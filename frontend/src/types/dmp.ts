export type DocumentType = 'EE' | 'EV';

export interface PersonName {
  vorname: string;
  nachname: string;
  titel: string;        // PFX QUAL="AC"
  namenszusatz: string; // PFX QUAL="NB"
  vorsatz: string;      // PFX QUAL="VV"
}

export interface Adresse {
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
}

export interface Provider {
  bsnr: string;
  lanr: string;
  name: PersonName;
  adresse: Adresse;
  telefon: string;
}

export interface Patient {
  patientId: string;
  bsnrRef: string;
  name: PersonName;
  adresse: Adresse;
  postfach: string;
  plzPostal: string;
  ortPostal: string;
  landPostal: string;
  geburtsdatum: string;
  geschlecht: string;
}

export interface Versicherung {
  kostentraegerbezeichnung: string;
  kostentraegerkennung: string;
  abrechnungsbereich: string;
  wop: string;
  versichertennummer: string;
  versichertenart: string;
  besonderePersonengruppe: string;
  dmpKennzeichnung: string;
  versicherungsschutzBeginn: string;
  versicherungsschutzEnde: string;
  einlesedatum: string;
}

export interface AdministrativeDaten {
  einschreibungWegen: string;
}

export interface AnamneseUndBefunddaten {
  koerpergroesse: string;
  koerpergewicht: string;
  blutdruckSystolisch: string;
  blutdruckDiastolisch: string;
  raucher: string;
  begleiterkrankungen: string;
  das28Wert: string;
  erkrankungsdauer: string;
  osteoporoserisiko: string;
}

export interface MedikamentoeseUndSonstigeMassnahmen {
  glukokortikoidtherapie: string;
  dmardTherapie: string;
  koerperlicheAktivitaet: string;
}

export interface Schulung {
  vorEinschreibungTeilgenommen: string; // nur EE
  schulungEmpfohlen: string;
  schulungWahrgenommen: string;         // nur EV
}

export interface Behandlungsplanung {
  informationsangebote: string;
  dokumentationsintervall: string;
}

export interface DmpDocument {
  documentType: DocumentType;
  id: string;
  setId: string;
  bsnr: string;
  versionNbr: string;
  serviceDate: string;
  originationDate: string;
  provider: Provider;
  patient: Patient;
  versicherung: Versicherung;
  administrative: AdministrativeDaten;
  anamnese: AnamneseUndBefunddaten;
  medikamentoes: MedikamentoeseUndSonstigeMassnahmen;
  schulung: Schulung;
  behandlungsplanung: Behandlungsplanung;
}
