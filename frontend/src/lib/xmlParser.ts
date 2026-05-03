import { XMLParser } from 'fast-xml-parser';
import type { DmpDocument, DocumentType, Adresse, PersonName } from '../types/dmp';

// fast-xml-parser v5 preserves namespace prefixes as part of the key name
// even with ignoreNameSpace:true. All sciphox elements use key 'sciphox:<name>'.
const SX = 'sciphox:';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) =>
    [
      'paragraph', 'id', 'PFX', 'telecom', 'addr', 'local_header',
      'Software', 'Kontakt', `${SX}Beobachtung`, `${SX}Ergebnistext`,
    ].includes(name),
  allowBooleanAttributes: true,
});

function attr(obj: unknown, key: string): string {
  if (!obj || typeof obj !== 'object') return '';
  return (obj as Record<string, string>)[`@_${key}`] ?? '';
}

type Rec = Record<string, unknown>;

function findBeobachtung(beobachtungen: unknown[], dn: string): Rec | undefined {
  return beobachtungen?.find(
    (b) => attr((b as Rec)[`${SX}Parameter`], 'DN') === dn
  ) as Rec | undefined;
}

function getText(beobachtungen: unknown[], dn: string): string {
  return getTexts(beobachtungen, dn)[0] ?? '';
}

// Gibt alle Ergebnistext-Werte zurück (für Mehrfachnennung wie körperliche Aktivität)
function getTexts(beobachtungen: unknown[], dn: string): string[] {
  const b = findBeobachtung(beobachtungen, dn);
  if (!b) return [];
  const et = b[`${SX}Ergebnistext`];
  if (Array.isArray(et)) return et.map((e) => attr(e, 'V')).filter(Boolean);
  if (et) return [attr(et, 'V')].filter(Boolean);
  return [];
}

function getWert(beobachtungen: unknown[], dn: string): string {
  const b = findBeobachtung(beobachtungen, dn);
  if (!b) return '';
  const ew = b[`${SX}Ergebniswert`];
  if (Array.isArray(ew)) return attr(ew[0], 'V');
  return attr(ew, 'V');
}

function getParagraphBeobachtungen(paragraphs: unknown[], sectionName: string): unknown[] {
  const p = paragraphs.find((p) => {
    const rec = p as Rec;
    const caption = rec.caption as Rec | undefined;
    return attr(caption?.caption_cd, 'DN') === sectionName;
  }) as Rec | undefined;

  const content = p?.content as Rec | undefined;
  const markup = content?.local_markup as Rec | undefined;
  const ssu = markup?.[`${SX}sciphox-ssu`] as Rec | undefined;
  const beobachtungen = ssu?.[`${SX}Beobachtungen`] as Rec | undefined;
  const beob = beobachtungen?.[`${SX}Beobachtung`];

  if (Array.isArray(beob)) return beob;
  if (beob) return [beob];
  return [];
}

function parseIds(ids: unknown[]): { bsnr: string; lanr: string } {
  const bsnrId = ids.find((id) => attr(id, 'RT') === 'BSNR');
  const lanrId = ids.find((id) => attr(id, 'RT') === 'LANR');
  return { bsnr: attr(bsnrId, 'EX'), lanr: attr(lanrId, 'EX') };
}

function parseName(nm: unknown): PersonName {
  const rec = nm as Rec | undefined;
  const pfx = Array.isArray(rec?.PFX) ? rec!.PFX : rec?.PFX ? [rec.PFX] : [];
  return {
    vorname: attr(rec?.GIV, 'V'),
    nachname: attr(rec?.FAM, 'V'),
    titel: attr(pfx.find((p: unknown) => attr(p, 'QUAL') === 'AC'), 'V'),
    namenszusatz: attr(pfx.find((p: unknown) => attr(p, 'QUAL') === 'NB'), 'V'),
    vorsatz: attr(pfx.find((p: unknown) => attr(p, 'QUAL') === 'VV'), 'V'),
  };
}

function parseAdresse(addr: unknown): Adresse {
  const a = addr as Rec | undefined;
  return {
    strasse: attr(a?.STR, 'V'),
    hausnummer: attr(a?.HNR, 'V'),
    plz: attr(a?.ZIP, 'V'),
    ort: attr(a?.CTY, 'V'),
    land: attr(a?.CNT, 'V') || 'DEU',
  };
}

export async function parseXmlFile(file: File): Promise<DmpDocument> {
  const buffer = await file.arrayBuffer();
  const decoder = new TextDecoder('iso-8859-15');
  const xmlString = decoder.decode(buffer);
  return parseXmlString(xmlString);
}

export function parseXmlString(xmlString: string): DmpDocument {
  const parsed = parser.parse(xmlString) as Rec;
  const root = parsed.levelone as Rec;
  const header = root.clinical_document_header as Rec;

  const docTypeV = attr(header.document_type_cd, 'V');
  const documentType: DocumentType = docTypeV.includes('_EE') ? 'EE' : 'EV';

  // Provider
  const providerEl = header.provider as Rec | undefined;
  const providerPerson = providerEl?.person as Rec | undefined;
  const provIds = Array.isArray(providerPerson?.id) ? providerPerson!.id as unknown[] : providerPerson?.id ? [providerPerson.id] : [];
  const provAddrs = Array.isArray(providerPerson?.addr) ? providerPerson!.addr as unknown[] : providerPerson?.addr ? [providerPerson.addr] : [];
  const provTelecoms = Array.isArray(providerPerson?.telecom) ? providerPerson!.telecom as unknown[] : providerPerson?.telecom ? [providerPerson.telecom] : [];
  const { bsnr: provBsnr, lanr: provLanr } = parseIds(provIds);

  const provider = {
    bsnr: provBsnr,
    lanr: provLanr,
    name: parseName((providerPerson?.person_name as Rec | undefined)?.nm),
    adresse: parseAdresse(provAddrs[0]),
    telefon: attr(provTelecoms[0], 'V'),
  };

  // Patient
  const patientEl = header.patient as Rec | undefined;
  const patientPerson = patientEl?.person as Rec | undefined;
  const patIds = Array.isArray(patientPerson?.id) ? patientPerson!.id as unknown[] : patientPerson?.id ? [patientPerson.id] : [];
  const patAddrs = Array.isArray(patientPerson?.addr) ? patientPerson!.addr as unknown[] : patientPerson?.addr ? [patientPerson.addr] : [];
  const physAddr = patAddrs.find((a) => attr(a, 'USE') === 'PHYS') ?? patAddrs[0];
  const pstAddr = patAddrs.find((a) => attr(a, 'USE') === 'PST') as Rec | undefined;
  const patId = patIds[0];

  const patient = {
    patientId: attr(patId, 'EX'),
    bsnrRef: attr(patId, 'RT'),
    name: parseName((patientPerson?.person_name as Rec | undefined)?.nm),
    adresse: parseAdresse(physAddr),
    postfach: attr((pstAddr as Rec | undefined)?.POB, 'V'),
    plzPostal: attr((pstAddr as Rec | undefined)?.ZIP, 'V'),
    ortPostal: attr((pstAddr as Rec | undefined)?.CTY, 'V'),
    landPostal: attr((pstAddr as Rec | undefined)?.CNT, 'V') || 'DEU',
    geburtsdatum: attr(patientEl?.birth_dttm, 'V'),
    geschlecht: attr(patientEl?.administrative_gender_cd, 'V'),
  };

  // Versicherung
  const patLocalHeaders = Array.isArray(patientEl?.local_header)
    ? patientEl!.local_header as unknown[]
    : patientEl?.local_header ? [patientEl.local_header] : [];
  const insuranceHeader = patLocalHeaders.find(
    (lh) => attr((lh as Rec)?.[`${SX}sciphox-ssu`], 'type') === 'insurance'
  ) as Rec | undefined;
  const ssu = insuranceHeader?.[`${SX}sciphox-ssu`] as Rec | undefined;
  const gkv = ssu?.[`${SX}GesetzlicheKrankenversicherung`] as Rec | undefined;

  const versicherung = {
    kostentraegerbezeichnung: attr(gkv?.[`${SX}Kostentraegerbezeichnung`], 'V'),
    kostentraegerkennung: attr(gkv?.[`${SX}Kostentraegerkennung`], 'V'),
    abrechnungsbereich: attr(gkv?.[`${SX}KostentraegerAbrechnungsbereich`], 'V'),
    wop: attr(gkv?.[`${SX}WOP`], 'V'),
    versichertennummer: attr(gkv?.[`${SX}Versichertennummer`], 'V'),
    versichertenart: attr(gkv?.[`${SX}Versichertenart`], 'V'),
    besonderePersonengruppe: attr(gkv?.[`${SX}BesonderePersonengruppe`], 'V'),
    dmpKennzeichnung: attr(gkv?.[`${SX}DMP_Kennzeichnung`], 'V'),
    versicherungsschutzBeginn: attr(gkv?.[`${SX}VersicherungsschutzBeginn`], 'V'),
    versicherungsschutzEnde: attr(gkv?.[`${SX}VersicherungsschutzEnde`], 'V'),
    einlesedatum: attr(gkv?.[`${SX}Einlesedatum`], 'V'),
  };

  // Body paragraphs
  const section = (root.body as Rec | undefined)?.section as Rec | undefined;
  const paragraphs = Array.isArray(section?.paragraph)
    ? section!.paragraph as unknown[]
    : section?.paragraph ? [section.paragraph] : [];

  const adminBeob = getParagraphBeobachtungen(paragraphs, 'Administrative Daten');
  const anamBeob = getParagraphBeobachtungen(paragraphs, 'Anamnese- und Befunddaten');
  const medBeob = getParagraphBeobachtungen(paragraphs, 'Medikamentöse und sonstige Maßnahmen');
  const schulBeob = getParagraphBeobachtungen(paragraphs, 'Schulung');
  const behandBeob = getParagraphBeobachtungen(paragraphs, 'Behandlungsplanung');

  return {
    documentType,
    id: attr(header.id, 'EX'),
    setId: attr(header.set_id, 'EX'),
    bsnr: attr(header.id, 'RT'),
    versionNbr: attr(header.version_nbr, 'V'),
    serviceDate: attr(header.service_tmr, 'V'),
    originationDate: attr(header.origination_dttm, 'V'),
    provider,
    patient,
    versicherung,
    administrative: {
      einschreibungWegen: getText(adminBeob, 'Einschreibung wegen'),
    },
    anamnese: {
      koerpergroesse: getWert(anamBeob, 'Körpergröße'),
      koerpergewicht: getWert(anamBeob, 'Körpergewicht'),
      blutdruckSystolisch: getWert(anamBeob, 'Blutdruck systolisch'),
      blutdruckDiastolisch: getWert(anamBeob, 'Blutdruck diastolisch'),
      raucher: getText(anamBeob, 'Raucher'),
      begleiterkrankungen: getText(anamBeob, 'Begleiterkrankungen'),
      das28Wert: getWert(anamBeob, 'Aktuelle Krankheitsaktivität - DAS-28-Wert'),
      erkrankungsdauer: getText(
        anamBeob,
        'Erkrankungsdauer der rheumatoiden Arthritis (zum Zeitpunkt der aktuellen Dokumentation)'
      ),
      osteoporoserisiko: getText(anamBeob, 'Klinische Einschätzung des Osteoporoserisikos durchgeführt'),
    },
    medikamentoes: {
      glukokortikoidtherapie: getText(medBeob, 'Aktuelle Glukokortikoidtherapie wegen rheumatoider Arthritis'),
      dmardTherapie: getText(medBeob, 'Aktuelle DMARD-Therapie'),
      koerperlicheAktivitaet: getTexts(medBeob, 'Regelmäßige körperliche Aktivität'),
    },
    schulung: {
      vorEinschreibungTeilgenommen: getText(
        schulBeob,
        'Bereits vor Einschreibung in das DMP an einer Rheuma-Schulung teilgenommen'
      ),
      schulungEmpfohlen: getText(schulBeob, 'Rheuma-Schulung empfohlen (bei aktueller Dokumentation)'),
      schulungWahrgenommen: getText(schulBeob, 'Rheuma-Schulung wahrgenommen'),
    },
    behandlungsplanung: {
      informationsangebote: getText(behandBeob, 'Vom Patienten gewünschte Informationsangebote der Krankenkasse'),
      dokumentationsintervall: getText(behandBeob, 'Dokumentationsintervall'),
    },
  };
}
