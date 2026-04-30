import type { MedikamentoeseUndSonstigeMassnahmen } from '../../types/dmp';
import { FormField, Select } from '../ui/FormField';
import {
  GLUKOKORTIKOID_THERAPIE,
  DMARD_THERAPIE,
  KOERPERLICHE_AKTIVITAET,
} from '../../data/schemaValues';

interface Props {
  data: MedikamentoeseUndSonstigeMassnahmen;
  onChange: (d: MedikamentoeseUndSonstigeMassnahmen) => void;
}

export function MedikamentoeseSection({ data, onChange }: Props) {
  const set = (field: keyof MedikamentoeseUndSonstigeMassnahmen, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="section-content">
      <div className="subsection">
        <h3 className="subsection-title">Medikamentöse und sonstige Maßnahmen</h3>
        <div className="form-grid form-grid--narrow">
          <FormField label="Aktuelle Glukokortikoidtherapie wegen rheumatoider Arthritis">
            <Select
              value={data.glukokortikoidtherapie}
              options={GLUKOKORTIKOID_THERAPIE}
              onChange={(v) => set('glukokortikoidtherapie', v)}
            />
          </FormField>
          <FormField label="Aktuelle DMARD-Therapie">
            <Select
              value={data.dmardTherapie}
              options={DMARD_THERAPIE}
              onChange={(v) => set('dmardTherapie', v)}
            />
          </FormField>
          <FormField label="Regelmäßige körperliche Aktivität">
            <Select
              value={data.koerperlicheAktivitaet}
              options={KOERPERLICHE_AKTIVITAET}
              onChange={(v) => set('koerperlicheAktivitaet', v)}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
