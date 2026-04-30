import type { Schulung, DocumentType } from '../../types/dmp';
import { FormField, Select } from '../ui/FormField';
import {
  SCHULUNG_VOR_EINSCHREIBUNG,
  SCHULUNG_EMPFOHLEN,
  SCHULUNG_WAHRGENOMMEN,
} from '../../data/schemaValues';

interface Props {
  data: Schulung;
  documentType: DocumentType;
  onChange: (d: Schulung) => void;
}

export function SchulungSection({ data, documentType, onChange }: Props) {
  const set = (field: keyof Schulung, value: string) => onChange({ ...data, [field]: value });

  return (
    <div className="section-content">
      <div className="subsection">
        <h3 className="subsection-title">Schulung</h3>
        <div className="form-grid form-grid--narrow">
          {documentType === 'EE' && (
            <FormField label="Bereits vor Einschreibung in das DMP an einer Rheuma-Schulung teilgenommen">
              <Select
                value={data.vorEinschreibungTeilgenommen}
                options={SCHULUNG_VOR_EINSCHREIBUNG}
                onChange={(v) => set('vorEinschreibungTeilgenommen', v)}
              />
            </FormField>
          )}
          <FormField label="Rheuma-Schulung empfohlen (bei aktueller Dokumentation)">
            <Select
              value={data.schulungEmpfohlen}
              options={SCHULUNG_EMPFOHLEN}
              onChange={(v) => set('schulungEmpfohlen', v)}
            />
          </FormField>
          {documentType === 'EV' && (
            <FormField label="Rheuma-Schulung wahrgenommen">
              <Select
                value={data.schulungWahrgenommen}
                options={SCHULUNG_WAHRGENOMMEN}
                onChange={(v) => set('schulungWahrgenommen', v)}
              />
            </FormField>
          )}
        </div>
      </div>
    </div>
  );
}
