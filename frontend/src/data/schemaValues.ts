// Alle Enum-Werte aus den XSD-Schemas (ErgebnistexteRA.xsd, ParameterRA.xsd)

export const EINSCHREIBUNG_WEGEN = [
  'KHK',
  'Diabetes mellitus Typ 1',
  'Diabetes mellitus Typ 2',
  'Asthma bronchiale',
  'COPD',
  'Chronische Herzinsuffizienz',
  'Depression',
  'chronischer Rückenschmerz',
  'Osteoporose',
  'rheumatoide Arthritis',
] as const;

export const BEGLEITERKRANKUNGEN = [
  'Keine der genannten Erkrankungen',
  'Arterielle Hypertonie',
  'Fettstoffwechselstörung',
  'Diabetes mellitus',
  'KHK',
  'AVK',
  'Chronische Herzinsuffizienz',
  'Asthma bronchiale',
  'COPD',
] as const;

export const RAUCHER = ['Ja', 'Nein'] as const;

export const ERKRANKUNGSDAUER_RA = [
  'Weniger als zwei Jahre',
  'Zwei Jahre oder mehr',
] as const;

export const OSTEOPOROSERISIKO = ['Ja', 'Nein'] as const;

export const GLUKOKORTIKOID_THERAPIE = [
  'Ja, bis zu 6 Monate lang',
  'Ja, länger als 6 Monate',
  'Nein',
] as const;

export const DMARD_THERAPIE = [
  'Ja',
  'Nein',
  'Kontraindikation',
  'Therapiepause vereinbart',
] as const;

export const KOERPERLICHE_AKTIVITAET = ['Ja', 'Nein', 'Nicht möglich'] as const;

export const SCHULUNG_VOR_EINSCHREIBUNG = ['Ja', 'Nein'] as const;

export const SCHULUNG_EMPFOHLEN = ['Ja', 'Nein'] as const;

export const SCHULUNG_WAHRGENOMMEN = [
  'Ja',
  'Nein',
  'War aktuell nicht möglich',
  'Bei letzter Dokumentation keine Schulung empfohlen',
] as const;

export const INFORMATIONSANGEBOTE = [
  'Tabakverzicht',
  'Ernährungsberatung',
  'Körperliches Training',
] as const;

export const DOKUMENTATIONSINTERVALL = [
  'Quartalsweise',
  'Jedes zweite Quartal',
] as const;

export const GESCHLECHT: { value: string; label: string }[] = [
  { value: 'M', label: 'Männlich' },
  { value: 'W', label: 'Weiblich' },
  { value: 'X', label: 'Divers' },
  { value: 'D', label: 'Divers (alt)' },
];

export const DOC_TYPE_V: Record<string, string> = {
  EE: 'EDMP_RHEUMATOIDE_ARTHRITIS_EE',
  EV: 'EDMP_RHEUMATOIDE_ARTHRITIS_EV',
};

export const DOC_TYPE_DN: Record<string, string> = {
  EE: 'Erstmalige Dokumentation Rheumatoide Arthritis',
  EV: 'Verlaufsdokumentation Rheumatoide Arthritis',
};
