import { useState, useRef } from 'react';
import type { DmpDocument } from './types/dmp';
import { createEmptyDocument } from './lib/emptyDocument';
import { parseXmlFile, parseXmlString } from './lib/xmlParser';
import { downloadXml, serializeToXml } from './lib/xmlSerializer';
import { validateDocument } from './lib/validation';
import { apiCreate, apiGetById, apiUpdate } from './lib/api';
import { DmpForm } from './components/DmpForm';
import { BackendDocumentList } from './components/BackendDocumentList';
import './App.css';

function computeQuartal(dateStr: string): string {
  const d = new Date(dateStr);
  const q = Math.ceil((d.getMonth() + 1) / 3);
  return `${q}/${d.getFullYear()}`;
}

export default function App() {
  const [doc, setDoc] = useState<DmpDocument | null>(null);
  const [backendId, setBackendId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [showBackendList, setShowBackendList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLoadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError(null);
      setShowValidation(false);
      const loaded = await parseXmlFile(file);
      setDoc(loaded);
      setBackendId(null);
    } catch (err) {
      setError(`Fehler beim Laden: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      e.target.value = '';
    }
  }

  function handleNewDoc(type: 'EE' | 'EV') {
    setError(null);
    setShowValidation(false);
    setBackendId(null);
    setDoc(createEmptyDocument(type));
  }

  async function handleLoadFromBackend(id: string) {
    try {
      setError(null);
      const detail = await apiGetById(id);
      const xmlString = new TextDecoder().decode(
        Uint8Array.from(atob(detail.xml), (c) => c.charCodeAt(0))
      );
      setDoc(parseXmlString(xmlString));
      setBackendId(id);
      setShowValidation(false);
      setShowBackendList(false);
    } catch (err) {
      setError(`Fehler beim Laden: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function handleCheckPlausi() {
    setShowValidation(true);
  }

  function handleExport() {
    if (!doc) return;
    setShowValidation(true);
    const errs = validateDocument(doc);
    if (errs.length > 0) {
      setError(`${errs.length} Plausibilitätsfehler gefunden. Bitte prüfen Sie die markierten Felder.`);
      return;
    }
    setError(null);
    downloadXml(doc);
  }

  async function handleSendToBackend() {
    if (!doc) return;
    setShowValidation(true);
    const errs = validateDocument(doc);
    if (errs.length > 0) {
      setError(`${errs.length} Plausibilitätsfehler gefunden. Übermittlung nicht möglich.`);
      return;
    }
    try {
      setError(null);
      const xml = serializeToXml(doc);
      const xmlB64 = btoa(unescape(encodeURIComponent(xml)));
      const payload = {
        pnr: doc.patient.patientId,
        type: doc.documentType,
        fall: doc.setId,
        serviceTmr: doc.serviceDate,
        originationDttm: doc.originationDate,
        quartal: computeQuartal(doc.serviceDate),
        lanr: doc.provider.lanr,
        bsnr: doc.provider.bsnr,
        ik: doc.versicherung.kostentraegerkennung,
        xml: xmlB64,
      };
      const id = backendId
        ? await apiUpdate(backendId, payload)
        : await apiCreate(payload);
      setBackendId(id);
      alert(`Dokument erfolgreich ${backendId ? 'aktualisiert' : 'gespeichert'}. ID: ${id}`);
    } catch (err) {
      setError(`Fehler beim Senden: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const plausiErrorCount = doc ? validateDocument(doc).length : 0;

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
          <button className="btn btn--outline" onClick={() => setShowBackendList(true)}>
            Gespeicherte Dokumente
          </button>
          {doc && (
            <>
              <button
                className={`btn ${plausiErrorCount > 0 && showValidation ? 'btn--warn' : 'btn--outline'}`}
                onClick={handleCheckPlausi}
                title="Plausibilitätsprüfung gemäß Anlage 22 DMP-A-RL"
              >
                Plausibilität prüfen
                {showValidation && plausiErrorCount > 0 && (
                  <span className="btn-badge">{plausiErrorCount}</span>
                )}
              </button>
              <button className="btn btn--outline" onClick={handleExport}>
                XML exportieren
              </button>
              <button className="btn btn--success" onClick={handleSendToBackend}>
                {backendId ? 'Im Backend aktualisieren' : 'Ans Backend senden'}
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

        {doc && <DmpForm doc={doc} onChange={setDoc} showValidation={showValidation} />}
      </main>

      {showBackendList && (
        <BackendDocumentList
          currentId={backendId}
          onLoad={handleLoadFromBackend}
          onClose={() => setShowBackendList(false)}
        />
      )}
    </div>
  );
}
