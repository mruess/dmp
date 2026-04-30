import type { AdministrativeDaten } from '../../types/dmp';
import { FormField, Select } from '../ui/FormField';
import { EINSCHREIBUNG_WEGEN } from '../../data/schemaValues';

interface Props {
  data: AdministrativeDaten;
  onChange: (d: AdministrativeDaten) => void;
}

export function AdministrativeSection({ data, onChange }: Props) {
  return (
    <div className="section-content">
      <div className="subsection">
        <h3 className="subsection-title">Administrative Daten</h3>
        <div className="form-grid form-grid--narrow">
          <FormField label="Einschreibung wegen" required>
            <Select
              value={data.einschreibungWegen}
              options={EINSCHREIBUNG_WEGEN}
              onChange={(v) => onChange({ ...data, einschreibungWegen: v })}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
