import { useState } from 'react';
import type { DmpDocument, Provider, Patient, Versicherung, AdministrativeDaten, AnamneseUndBefunddaten, MedikamentoeseUndSonstigeMassnahmen, Schulung, Behandlungsplanung } from '../types/dmp';
import { KopfdatenSection } from './sections/KopfdatenSection';
import { AdministrativeSection } from './sections/AdministrativeSection';
import { AnamneseSection } from './sections/AnamneseSection';
import { MedikamentoeseSection } from './sections/MedikamentoeseSection';
import { SchulungSection } from './sections/SchulungSection';
import { BehandlungsplanungSection } from './sections/BehandlungsplanungSection';

const TABS = [
  { id: 'kopfdaten', label: 'Kopfdaten' },
  { id: 'administrative', label: 'Administrative Daten' },
  { id: 'anamnese', label: 'Anamnese & Befund' },
  { id: 'medikamentoes', label: 'Medikamentöse Maßnahmen' },
  { id: 'schulung', label: 'Schulung' },
  { id: 'behandlungsplanung', label: 'Behandlungsplanung' },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface Props {
  doc: DmpDocument;
  onChange: (doc: DmpDocument) => void;
}

export function DmpForm({ doc, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('kopfdaten');

  const docTypeBadge = doc.documentType === 'EE'
    ? <span className="badge badge--ee">Erstdokumentation</span>
    : <span className="badge badge--ev">Verlaufsdokumentation</span>;

  return (
    <div className="dmp-form">
      <div className="dmp-form__header">
        <div className="dmp-form__title">
          <span className="dmp-form__disease">Rheumatoide Arthritis</span>
          {docTypeBadge}
        </div>
        <div className="dmp-form__meta">
          BSNR: {doc.bsnr || '–'} &nbsp;|&nbsp;
          Patient-ID: {doc.setId || '–'} &nbsp;|&nbsp;
          Datum: {doc.serviceDate || '–'}
        </div>
      </div>

      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {activeTab === 'kopfdaten' && (
          <KopfdatenSection
            provider={doc.provider}
            patient={doc.patient}
            versicherung={doc.versicherung}
            serviceDate={doc.serviceDate}
            originationDate={doc.originationDate}
            id={doc.id}
            setId={doc.setId}
            versionNbr={doc.versionNbr}
            onProviderChange={(p: Provider) => onChange({ ...doc, provider: p })}
            onPatientChange={(p: Patient) => onChange({ ...doc, patient: p })}
            onVersicherungChange={(v: Versicherung) => onChange({ ...doc, versicherung: v })}
            onFieldChange={(field: string, value: string) => onChange({ ...doc, [field]: value })}
          />
        )}
        {activeTab === 'administrative' && (
          <AdministrativeSection
            data={doc.administrative}
            onChange={(d: AdministrativeDaten) => onChange({ ...doc, administrative: d })}
          />
        )}
        {activeTab === 'anamnese' && (
          <AnamneseSection
            data={doc.anamnese}
            onChange={(d: AnamneseUndBefunddaten) => onChange({ ...doc, anamnese: d })}
          />
        )}
        {activeTab === 'medikamentoes' && (
          <MedikamentoeseSection
            data={doc.medikamentoes}
            onChange={(d: MedikamentoeseUndSonstigeMassnahmen) => onChange({ ...doc, medikamentoes: d })}
          />
        )}
        {activeTab === 'schulung' && (
          <SchulungSection
            data={doc.schulung}
            documentType={doc.documentType}
            onChange={(d: Schulung) => onChange({ ...doc, schulung: d })}
          />
        )}
        {activeTab === 'behandlungsplanung' && (
          <BehandlungsplanungSection
            data={doc.behandlungsplanung}
            onChange={(d: Behandlungsplanung) => onChange({ ...doc, behandlungsplanung: d })}
          />
        )}
      </div>
    </div>
  );
}
