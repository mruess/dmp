import type { DmpDocument, DocumentType } from '../types/dmp';

const today = () => new Date().toISOString().split('T')[0];

export function createEmptyDocument(documentType: DocumentType): DmpDocument {
  return {
    documentType,
    id: '1',
    setId: '',
    bsnr: '',
    versionNbr: '1',
    serviceDate: today(),
    originationDate: today(),
    provider: {
      bsnr: '',
      lanr: '',
      name: { vorname: '', nachname: '', titel: '', namenszusatz: '', vorsatz: '' },
      adresse: { strasse: '', hausnummer: '', plz: '', ort: '', land: 'DEU' },
      telefon: '',
    },
    patient: {
      patientId: '',
      bsnrRef: '',
      name: { vorname: '', nachname: '', titel: '', namenszusatz: '', vorsatz: '' },
      adresse: { strasse: '', hausnummer: '', plz: '', ort: '', land: 'DEU' },
      postfach: '',
      plzPostal: '',
      ortPostal: '',
      landPostal: 'DEU',
      geburtsdatum: '',
      geschlecht: '',
    },
    versicherung: {
      kostentraegerbezeichnung: '',
      kostentraegerkennung: '',
      abrechnungsbereich: '00',
      wop: '',
      versichertennummer: '',
      versichertenart: '1',
      besonderePersonengruppe: '',
      dmpKennzeichnung: '',
      versicherungsschutzBeginn: '',
      versicherungsschutzEnde: '',
      einlesedatum: today(),
    },
    administrative: {
      einschreibungWegen: 'rheumatoide Arthritis',
    },
    anamnese: {
      koerpergroesse: '',
      koerpergewicht: '',
      blutdruckSystolisch: '',
      blutdruckDiastolisch: '',
      raucher: '',
      begleiterkrankungen: '',
      das28Wert: '',
      erkrankungsdauer: '',
      osteoporoserisiko: '',
    },
    medikamentoes: {
      glukokortikoidtherapie: '',
      dmardTherapie: '',
      koerperlicheAktivitaet: '',
    },
    schulung: {
      vorEinschreibungTeilgenommen: '',
      schulungEmpfohlen: '',
      schulungWahrgenommen: '',
    },
    behandlungsplanung: {
      informationsangebote: '',
      dokumentationsintervall: '',
    },
  };
}
