import type { Behandlungsplanung } from '../../types/dmp';
import { FormField, Select } from '../ui/FormField';
import { INFORMATIONSANGEBOTE, DOKUMENTATIONSINTERVALL } from '../../data/schemaValues';

interface Props {
  data: Behandlungsplanung;
  onChange: (d: Behandlungsplanung) => void;
}

export function BehandlungsplanungSection({ data, onChange }: Props) {
  const set = (field: keyof Behandlungsplanung, value: string) => onChange({ ...data, [field]: value });

  return (
    <div className="section-content">
      <div className="subsection">
        <h3 className="subsection-title">Behandlungsplanung</h3>
        <div className="form-grid form-grid--narrow">
          <FormField label="Vom Patienten gewünschte Informationsangebote der Krankenkasse">
            <Select
              value={data.informationsangebote}
              options={INFORMATIONSANGEBOTE}
              onChange={(v) => set('informationsangebote', v)}
            />
          </FormField>
          <FormField label="Dokumentationsintervall">
            <Select
              value={data.dokumentationsintervall}
              options={DOKUMENTATIONSINTERVALL}
              onChange={(v) => set('dokumentationsintervall', v)}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
