import { useState, useMemo } from 'react';
import type {
  DmpDocument, Provider, Patient, Versicherung,
  AdministrativeDaten, AnamneseUndBefunddaten,
  MedikamentoeseUndSonstigeMassnahmen, Schulung, Behandlungsplanung,
} from '../types/dmp';
import { validateDocument, errorsForSection } from '../lib/validation';
import { KopfdatenSection } from './sections/KopfdatenSection';
import { AdministrativeSection } from './sections/AdministrativeSection';
import { AnamneseSection } from './sections/AnamneseSection';
import { MedikamentoeseSection } from './sections/MedikamentoeseSection';
import { SchulungSection } from './sections/SchulungSection';
import { BehandlungsplanungSection } from './sections/BehandlungsplanungSection';

const TABS = [
  { id: 'kopfdaten', label: 'Kopfdaten', section: '' },
  { id: 'administrative', label: 'Administrative Daten', section: 'administrative' },
  { id: 'anamnese', label: 'Anamnese & Befund', section: 'anamnese' },
  { id: 'medikamentoes', label: 'Medikamentöse Maßnahmen', section: 'medikamentoes' },
  { id: 'schulung', label: 'Schulung', section: 'schulung' },
  { id: 'behandlungsplanung', label: 'Behandlungsplanung', section: 'behandlungsplanung' },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface Props {
  doc: DmpDocument;
  onChange: (doc: DmpDocument) => void;
  showValidation?: boolean;
}

export function DmpForm({ doc, onChange, showValidation = false }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('kopfdaten');

  const allErrors = useMemo(() => validateDocument(doc), [doc]);
  const errorsBySectionMap = useMemo(
    () =>
      Object.fromEntries(
        TABS.filter((t) => t.section).map((t) => [t.section, errorsForSection(allErrors, t.section)])
      ),
    [allErrors]
  );

  function errCountForTab(section: string): number {
    if (!showValidation || !section) return 0;
    return allErrors.filter((e) => e.section === section).length;
  }

  const docTypeBadge =
    doc.documentType === 'EE'
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

      {showValidation && allErrors.length > 0 && (
        <div className="validation-summary">
          <strong>Plausibilitätsfehler ({allErrors.length}):</strong>
          <ul>
            {allErrors.map((e, i) => (
              <li key={i}>
                <button
                  className="validation-summary__link"
                  onClick={() => setActiveTab(TABS.find((t) => t.section === e.section)?.id ?? 'kopfdaten')}
                  type="button"
                >
                  {TABS.find((t) => t.section === e.section)?.label ?? e.section}
                </button>
                {' → '}{e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showValidation && allErrors.length === 0 && (
        <div className="validation-ok">
          Alle Plausibilitätsprüfungen bestanden.
        </div>
      )}

      <nav className="tab-nav">
        {TABS.map((tab) => {
          const errCount = errCountForTab(tab.section);
          return (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' tab-btn--active' : ''}${errCount > 0 ? ' tab-btn--has-errors' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
              {errCount > 0 && <span className="tab-error-badge">{errCount}</span>}
            </button>
          );
        })}
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
            errors={showValidation ? errorsBySectionMap['anamnese'] : {}}
          />
        )}
        {activeTab === 'medikamentoes' && (
          <MedikamentoeseSection
            data={doc.medikamentoes}
            onChange={(d: MedikamentoeseUndSonstigeMassnahmen) => onChange({ ...doc, medikamentoes: d })}
            errors={showValidation ? errorsBySectionMap['medikamentoes'] : {}}
          />
        )}
        {activeTab === 'schulung' && (
          <SchulungSection
            data={doc.schulung}
            documentType={doc.documentType}
            onChange={(d: Schulung) => onChange({ ...doc, schulung: d })}
            errors={showValidation ? errorsBySectionMap['schulung'] : {}}
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
