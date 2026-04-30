import type { DmpDocument } from '../types/dmp';

export interface ValidationError {
  field: string;
  section: string;
  message: string;
}

// Alle Regeln aus Anlage 22 der DMP-A-RL (Plausi_eDMP_Rheuma.pdf, Version 1.0, Stand 15.09.2021)
export function validateDocument(doc: DmpDocument): ValidationError[] {
  const errors: ValidationError[] = [];
  const add = (section: string, field: string, message: string) =>
    errors.push({ section, field, message });

  const { anamnese: a, medikamentoes: m, schulung: s } = doc;

  // === Anamnese- und Befunddaten ===

  // Regel 1: DAS-28-Wert – Pflichtfeld, Format X.X, Wertebereich 0,0–9,9
  if (!a.das28Wert) {
    add('anamnese', 'das28Wert', 'Pflichtfeld');
  } else if (!/^[0-9]\.[0-9]$/.test(a.das28Wert)) {
    add('anamnese', 'das28Wert', 'Format: eine Vor- und eine Nachkommastelle (z. B. 4,1)');
  } else {
    const val = parseFloat(a.das28Wert);
    if (val < 0.0 || val > 9.9) {
      add('anamnese', 'das28Wert', 'Wert muss ≥ 0,0 und ≤ 9,9 sein');
    }
  }

  // Regel 2: Erkrankungsdauer – Pflichtfeld
  if (!a.erkrankungsdauer) {
    add('anamnese', 'erkrankungsdauer', 'Pflichtfeld');
  }

  // Regel 3: Osteoporoserisiko – Pflichtfeld
  if (!a.osteoporoserisiko) {
    add('anamnese', 'osteoporoserisiko', 'Pflichtfeld');
  }

  // === Medikamentöse und sonstige Maßnahmen ===

  // Regel 4: Glukokortikoidtherapie – Pflichtfeld
  if (!m.glukokortikoidtherapie) {
    add('medikamentoes', 'glukokortikoidtherapie', 'Pflichtfeld');
  }

  // Regel 5: DMARD-Therapie – Pflichtfeld
  if (!m.dmardTherapie) {
    add('medikamentoes', 'dmardTherapie', 'Pflichtfeld');
  }

  // Regel 6: Körperliche Aktivität – Pflichtfeld, Mehrfachnennung mit Einschränkung
  if (!m.koerperlicheAktivitaet || m.koerperlicheAktivitaet.length === 0) {
    add('medikamentoes', 'koerperlicheAktivitaet', 'Pflichtfeld');
  } else if (m.koerperlicheAktivitaet.includes('Ja') && m.koerperlicheAktivitaet.length > 1) {
    add('medikamentoes', 'koerperlicheAktivitaet', '„Ja" kann nicht mit anderen Angaben kombiniert werden');
  }

  // === Schulung ===

  // Regel 7: Schulung vor Einschreibung – nur EE (Erstdokumentation)
  if (doc.documentType === 'EE' && !s.vorEinschreibungTeilgenommen) {
    add('schulung', 'vorEinschreibungTeilgenommen', 'Pflichtfeld bei Erstdokumentation');
  }
  if (doc.documentType === 'EV' && s.vorEinschreibungTeilgenommen) {
    add('schulung', 'vorEinschreibungTeilgenommen', 'Nicht zulässig bei Verlaufsdokumentation');
  }

  // Regel 8: Schulung empfohlen – Pflichtfeld
  if (!s.schulungEmpfohlen) {
    add('schulung', 'schulungEmpfohlen', 'Pflichtfeld');
  }

  // Regel 9: Schulung wahrgenommen – nur EV (Verlaufsdokumentation)
  if (doc.documentType === 'EV' && !s.schulungWahrgenommen) {
    add('schulung', 'schulungWahrgenommen', 'Pflichtfeld bei Verlaufsdokumentation');
  }
  if (doc.documentType === 'EE' && s.schulungWahrgenommen) {
    add('schulung', 'schulungWahrgenommen', 'Nicht zulässig bei Erstdokumentation');
  }

  return errors;
}

export function errorsForSection(errors: ValidationError[], section: string): Record<string, string> {
  return Object.fromEntries(
    errors.filter((e) => e.section === section).map((e) => [e.field, e.message])
  );
}
