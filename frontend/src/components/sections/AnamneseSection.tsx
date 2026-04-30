import type { AnamneseUndBefunddaten } from '../../types/dmp';
import { FormField, Input, Select } from '../ui/FormField';
import {
  RAUCHER,
  BEGLEITERKRANKUNGEN,
  ERKRANKUNGSDAUER_RA,
  OSTEOPOROSERISIKO,
} from '../../data/schemaValues';

interface Props {
  data: AnamneseUndBefunddaten;
  onChange: (d: AnamneseUndBefunddaten) => void;
  errors?: Record<string, string>;
}

export function AnamneseSection({ data, onChange, errors = {} }: Props) {
  const set = (field: keyof AnamneseUndBefunddaten, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="section-content">
      <div className="subsection">
        <h3 className="subsection-title">Anamnese- und Befunddaten</h3>
        <div className="form-grid">
          <FormField label="Körpergröße" hint="Einheit: m (z. B. 1.80)">
            <Input value={data.koerpergroesse} onChange={(v) => set('koerpergroesse', v)} placeholder="1.80" />
          </FormField>
          <FormField label="Körpergewicht" hint="Einheit: kg (z. B. 080)">
            <Input value={data.koerpergewicht} onChange={(v) => set('koerpergewicht', v)} placeholder="080" />
          </FormField>
          <FormField label="Blutdruck systolisch" hint="Einheit: mmHg">
            <Input value={data.blutdruckSystolisch} onChange={(v) => set('blutdruckSystolisch', v)} placeholder="120" />
          </FormField>
          <FormField label="Blutdruck diastolisch" hint="Einheit: mmHg">
            <Input value={data.blutdruckDiastolisch} onChange={(v) => set('blutdruckDiastolisch', v)} placeholder="80" />
          </FormField>
          <FormField label="Raucher">
            <Select value={data.raucher} options={RAUCHER} onChange={(v) => set('raucher', v)} />
          </FormField>
          <FormField label="Begleiterkrankungen">
            <Select value={data.begleiterkrankungen} options={BEGLEITERKRANKUNGEN} onChange={(v) => set('begleiterkrankungen', v)} />
          </FormField>

          {/* Plausi-Regel 1: DAS-28 – Pflichtfeld, Format X.X, Bereich 0,0–9,9 */}
          <FormField
            label="DAS-28-Wert"
            hint="Wertebereich 0,0–9,9, genau eine Vor- und Nachkommastelle"
            error={errors.das28Wert}
          >
            <Input
              value={data.das28Wert}
              onChange={(v) => set('das28Wert', v)}
              placeholder="4.1"
              error={!!errors.das28Wert}
            />
          </FormField>

          {/* Plausi-Regel 2 */}
          <FormField label="Erkrankungsdauer RA" error={errors.erkrankungsdauer}>
            <Select
              value={data.erkrankungsdauer}
              options={ERKRANKUNGSDAUER_RA}
              onChange={(v) => set('erkrankungsdauer', v)}
              error={!!errors.erkrankungsdauer}
            />
          </FormField>

          {/* Plausi-Regel 3 */}
          <FormField label="Klinische Einschätzung Osteoporoserisiko durchgeführt" error={errors.osteoporoserisiko}>
            <Select
              value={data.osteoporoserisiko}
              options={OSTEOPOROSERISIKO}
              onChange={(v) => set('osteoporoserisiko', v)}
              error={!!errors.osteoporoserisiko}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
