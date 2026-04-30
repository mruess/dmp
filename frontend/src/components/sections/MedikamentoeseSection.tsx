import type { MedikamentoeseUndSonstigeMassnahmen } from '../../types/dmp';
import { FormField, Select, CheckboxGroup } from '../ui/FormField';
import {
  GLUKOKORTIKOID_THERAPIE,
  DMARD_THERAPIE,
  KOERPERLICHE_AKTIVITAET,
} from '../../data/schemaValues';

interface Props {
  data: MedikamentoeseUndSonstigeMassnahmen;
  onChange: (d: MedikamentoeseUndSonstigeMassnahmen) => void;
  errors?: Record<string, string>;
}

export function MedikamentoeseSection({ data, onChange, errors = {} }: Props) {
  return (
    <div className="section-content">
      <div className="subsection">
        <h3 className="subsection-title">Medikamentöse und sonstige Maßnahmen</h3>
        <div className="form-grid form-grid--narrow">

          {/* Plausi-Regel 4 */}
          <FormField
            label="Aktuelle Glukokortikoidtherapie wegen rheumatoider Arthritis"
            error={errors.glukokortikoidtherapie}
          >
            <Select
              value={data.glukokortikoidtherapie}
              options={GLUKOKORTIKOID_THERAPIE}
              onChange={(v) => onChange({ ...data, glukokortikoidtherapie: v })}
              error={!!errors.glukokortikoidtherapie}
            />
          </FormField>

          {/* Plausi-Regel 5 */}
          <FormField label="Aktuelle DMARD-Therapie" error={errors.dmardTherapie}>
            <Select
              value={data.dmardTherapie}
              options={DMARD_THERAPIE}
              onChange={(v) => onChange({ ...data, dmardTherapie: v })}
              error={!!errors.dmardTherapie}
            />
          </FormField>

          {/* Plausi-Regel 6: Mehrfachnennung möglich; „Ja" schließt andere aus */}
          <FormField
            label="Regelmäßige körperliche Aktivität"
            hint='Mehrfachauswahl möglich. „Ja" schließt andere Angaben aus.'
            error={errors.koerperlicheAktivitaet}
          >
            <CheckboxGroup
              options={KOERPERLICHE_AKTIVITAET}
              value={data.koerperlicheAktivitaet}
              onChange={(v) => onChange({ ...data, koerperlicheAktivitaet: v })}
              exclusiveOption="Ja"
              error={!!errors.koerperlicheAktivitaet}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
