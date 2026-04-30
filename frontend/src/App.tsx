import { useState, useRef } from 'react';
import type { DmpDocument } from './types/dmp';
import { createEmptyDocument } from './lib/emptyDocument';
import { parseXmlFile } from './lib/xmlParser';
import { downloadXml, serializeToXml } from './lib/xmlSerializer';
import { DmpForm } from './components/DmpForm';
import './App.css';

export default function App() {
  const [doc, setDoc] = useState<DmpDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLoadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError(null);
      const loaded = await parseXmlFile(file);
      setDoc(loaded);
    } catch (err) {
      setError(`Fehler beim Laden: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      e.target.value = '';
    }
  }

  function handleNewDoc(type: 'EE' | 'EV') {
    setError(null);
    setDoc(createEmptyDocument(type));
  }

  async function handleSendToBackend() {
    if (!doc) return;
    try {
      setError(null);
      const xml = serializeToXml(doc);
      const resp = await fetch('/api/dmp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        body: xml,
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
      alert('Dokument erfolgreich übermittelt.');
    } catch (err) {
      setError(`Fehler beim Senden: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__logo">eDMP</span>
          <span className="app-header__subtitle">Rheumatoide Arthritis · KBV / HL7 Sciphox</span>
        </div>
        <div className="app-header__actions">
          <button className="btn btn--primary" onClick={() => handleNewDoc('EE')}>
            + Erstdokumentation
          </button>
          <button className="btn btn--secondary" onClick={() => handleNewDoc('EV')}>
            + Verlaufsdokumentation
          </button>
          <button className="btn btn--outline" onClick={() => fileInputRef.current?.click()}>
            XML laden
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".EERA,.EVRA,.xml"
            onChange={handleLoadFile}
            style={{ display: 'none' }}
          />
          {doc && (
            <>
              <button className="btn btn--outline" onClick={() => downloadXml(doc)}>
                XML exportieren
              </button>
              <button className="btn btn--success" onClick={handleSendToBackend}>
                Ans Backend senden
              </button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <strong>Fehler:</strong> {error}
          </div>
        )}

        {!doc && (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h2>Kein Dokument geladen</h2>
            <p>
              Erstellen Sie eine neue Erst- oder Verlaufsdokumentation,<br />
              oder laden Sie eine vorhandene <code>.EERA</code> / <code>.EVRA</code> Datei.
            </p>
            <div className="empty-state__actions">
              <button className="btn btn--primary btn--lg" onClick={() => handleNewDoc('EE')}>
                Neue Erstdokumentation
              </button>
              <button className="btn btn--secondary btn--lg" onClick={() => handleNewDoc('EV')}>
                Neue Verlaufsdokumentation
              </button>
              <button className="btn btn--outline btn--lg" onClick={() => fileInputRef.current?.click()}>
                XML-Datei laden
              </button>
            </div>
          </div>
        )}

        {doc && <DmpForm doc={doc} onChange={setDoc} />}
      </main>
    </div>
  );
}
