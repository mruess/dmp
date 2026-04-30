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
  errors?: Record<string, string>;
}

export function SchulungSection({ data, documentType, onChange, errors = {} }: Props) {
  const set = (field: keyof Schulung, value: string) => onChange({ ...data, [field]: value });

  return (
    <div className="section-content">
      <div className="subsection">
        <h3 className="subsection-title">Schulung</h3>
        <div className="form-grid form-grid--narrow">

          {/* Plausi-Regel 7: nur EE; bei EV nicht zulässig */}
          {documentType === 'EE' && (
            <FormField
              label="Bereits vor Einschreibung in das DMP an einer Rheuma-Schulung teilgenommen"
              error={errors.vorEinschreibungTeilgenommen}
            >
              <Select
                value={data.vorEinschreibungTeilgenommen}
                options={SCHULUNG_VOR_EINSCHREIBUNG}
                onChange={(v) => set('vorEinschreibungTeilgenommen', v)}
                error={!!errors.vorEinschreibungTeilgenommen}
              />
            </FormField>
          )}

          {/* Plausi-Regel 8 */}
          <FormField
            label="Rheuma-Schulung empfohlen (bei aktueller Dokumentation)"
            error={errors.schulungEmpfohlen}
          >
            <Select
              value={data.schulungEmpfohlen}
              options={SCHULUNG_EMPFOHLEN}
              onChange={(v) => set('schulungEmpfohlen', v)}
              error={!!errors.schulungEmpfohlen}
            />
          </FormField>

          {/* Plausi-Regel 9: nur EV; bei EE nicht zulässig */}
          {documentType === 'EV' && (
            <FormField
              label="Rheuma-Schulung wahrgenommen"
              error={errors.schulungWahrgenommen}
            >
              <Select
                value={data.schulungWahrgenommen}
                options={SCHULUNG_WAHRGENOMMEN}
                onChange={(v) => set('schulungWahrgenommen', v)}
                error={!!errors.schulungWahrgenommen}
              />
            </FormField>
          )}
        </div>
      </div>
    </div>
  );
}
