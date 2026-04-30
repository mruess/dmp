import type { DmpDocument, PersonName } from '../types/dmp';
import { DOC_TYPE_V, DOC_TYPE_DN } from '../data/schemaValues';

function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function textBeob(dn: string, v: string): string {
  if (!v) return '';
  return `
				<sciphox:Beobachtung>
					<sciphox:Parameter DN="${escXml(dn)}"/>
					<sciphox:Ergebnistext V="${escXml(v)}"/>
				</sciphox:Beobachtung>`;
}

// Mehrfachnennung (Plausi-Regel 6: körperliche Aktivität)
function textBeobMulti(dn: string, vs: string[]): string {
  if (!vs || vs.length === 0) return '';
  const etLines = vs.map((v) => `\t\t\t\t\t<sciphox:Ergebnistext V="${escXml(v)}"/>`).join('\n');
  return `
				<sciphox:Beobachtung>
					<sciphox:Parameter DN="${escXml(dn)}"/>
${etLines}
				</sciphox:Beobachtung>`;
}

function wertBeob(dn: string, v: string, u: string): string {
  if (!v) return '';
  return `
				<sciphox:Beobachtung>
					<sciphox:Parameter DN="${escXml(dn)}"/>
					<sciphox:Ergebniswert V="${escXml(v)}" U="${escXml(u)}"/>
				</sciphox:Beobachtung>`;
}

function paragraph(captionDN: string, beobachtungen: string): string {
  return `
		<paragraph>
			<caption>
				<caption_cd DN="${escXml(captionDN)}"/>
			</caption>
			<content>
				<local_markup ignore="all" descriptor="sciphox">
					<sciphox:sciphox-ssu type="observation" country="de" version="v1">
						<sciphox:Beobachtungen>${beobachtungen}
						</sciphox:Beobachtungen>
					</sciphox:sciphox-ssu>
				</local_markup>
			</content>
		</paragraph>`;
}

function pfxElements(name: PersonName): string {
  const parts: string[] = [];
  if (name.titel) parts.push(`<PFX V="${escXml(name.titel)}" QUAL="AC"/>`);
  if (name.namenszusatz) parts.push(`<PFX V="${escXml(name.namenszusatz)}" QUAL="NB"/>`);
  if (name.vorsatz) parts.push(`<PFX V="${escXml(name.vorsatz)}" QUAL="VV"/>`);
  return parts.length ? '\n\t\t\t\t\t\t' + parts.join('\n\t\t\t\t\t\t') : '';
}

export function serializeToXml(doc: DmpDocument): string {
  const { provider, patient, versicherung, administrative, anamnese, medikamentoes, schulung, behandlungsplanung } = doc;

  const docTypeV = DOC_TYPE_V[doc.documentType] ?? '';
  const docTypeDN = DOC_TYPE_DN[doc.documentType] ?? '';

  // Schulung-Sektion: EE hat VorEinschreibung, EV hat Wahrgenommen
  const schulungBeob =
    doc.documentType === 'EE'
      ? textBeob(
          'Bereits vor Einschreibung in das DMP an einer Rheuma-Schulung teilgenommen',
          schulung.vorEinschreibungTeilgenommen
        ) + textBeob('Rheuma-Schulung empfohlen (bei aktueller Dokumentation)', schulung.schulungEmpfohlen)
      : textBeob('Rheuma-Schulung empfohlen (bei aktueller Dokumentation)', schulung.schulungEmpfohlen) +
        textBeob('Rheuma-Schulung wahrgenommen', schulung.schulungWahrgenommen);

  // Patientenadresse(n)
  const physAddrXml = `
			<addr USE="PHYS">
				<STR V="${escXml(patient.adresse.strasse)}"/>
				<HNR V="${escXml(patient.adresse.hausnummer)}"/>
				<ZIP V="${escXml(patient.adresse.plz)}"/>
				<CTY V="${escXml(patient.adresse.ort)}"/>
				<CNT V="${escXml(patient.adresse.land)}"/>
			</addr>`;

  const pstAddrXml =
    patient.postfach || patient.plzPostal
      ? `
			<addr USE="PST">
				<ZIP V="${escXml(patient.plzPostal)}"/>
				<CTY V="${escXml(patient.ortPostal)}"/>
				<CNT V="${escXml(patient.landPostal)}"/>
				<POB V="${escXml(patient.postfach)}"/>
			</addr>`
      : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<levelone xmlns="urn::hl7-org/cda" xmlns:sciphox="urn::sciphox-org/sciphox" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn::hl7-org/cda ../Schema/DMP_Rheumatoide_Arthritis.xsd">
	<clinical_document_header>
		<id EX="${escXml(doc.id)}" RT="${escXml(doc.bsnr)}"/>
		<set_id EX="${escXml(doc.setId)}" RT="${escXml(doc.bsnr)}"/>
		<version_nbr V="${escXml(doc.versionNbr)}"/>
		<document_type_cd V="${escXml(docTypeV)}" S="1.2.276.0.76.5.100" SN="KBV" DN="${escXml(docTypeDN)}"/>
		<service_tmr V="${escXml(doc.serviceDate)}"/>
		<origination_dttm V="${escXml(doc.originationDate)}"/>
		<provider>
			<provider.type_cd V="PRF"/>
			<person>
				<id EX="${escXml(provider.bsnr)}" RT="BSNR"/>
				<id EX="${escXml(provider.lanr)}" RT="LANR"/>
				<person_name>
					<nm>
						<GIV V="${escXml(provider.name.vorname)}"/>
						<FAM V="${escXml(provider.name.nachname)}"/>${pfxElements(provider.name)}
					</nm>
				</person_name>
				<addr>
					<STR V="${escXml(provider.adresse.strasse)}"/>
					<HNR V="${escXml(provider.adresse.hausnummer)}"/>
					<ZIP V="${escXml(provider.adresse.plz)}"/>
					<CTY V="${escXml(provider.adresse.ort)}"/>
				</addr>
				<telecom V="${escXml(provider.telefon)}" USE="WP"/>
			</person>
		</provider>
		<patient>
			<patient.type_cd V="PATSBJ"/>
			<person>
				<id EX="${escXml(patient.patientId)}" RT="${escXml(patient.bsnrRef || doc.bsnr)}"/>
				<person_name>
					<nm>
						<GIV V="${escXml(patient.name.vorname)}"/>
						<FAM V="${escXml(patient.name.nachname)}"/>
					</nm>
				</person_name>${physAddrXml}${pstAddrXml}
			</person>
			<birth_dttm V="${escXml(patient.geburtsdatum)}"/>
			<administrative_gender_cd V="${escXml(patient.geschlecht)}"/>
			<local_header ignore="all" descriptor="sciphox">
				<sciphox:sciphox-ssu type="insurance" country="de" version="v3">
					<sciphox:GesetzlicheKrankenversicherung>
						<sciphox:Kostentraegerbezeichnung V="${escXml(versicherung.kostentraegerbezeichnung)}"/>
						<sciphox:Kostentraegerkennung V="${escXml(versicherung.kostentraegerkennung)}"/>
						<sciphox:KostentraegerAbrechnungsbereich V="${escXml(versicherung.abrechnungsbereich)}" S="2.16.840.1.113883.3.7.1.16"/>
						<sciphox:WOP V="${escXml(versicherung.wop)}" S="2.16.840.1.113883.3.7.1.17"/>
						<sciphox:Versichertennummer V="${escXml(versicherung.versichertennummer)}"/>
						<sciphox:Versichertenart V="${escXml(versicherung.versichertenart)}" S="1.2.276.0.76.5.222"/>
						<sciphox:BesonderePersonengruppe V="${escXml(versicherung.besonderePersonengruppe)}" S="1.2.276.0.76.5.222"/>
						<sciphox:DMP_Kennzeichnung V="${escXml(versicherung.dmpKennzeichnung)}" S="1.2.276.0.76.5.223"/>
						<sciphox:VersicherungsschutzBeginn V="${escXml(versicherung.versicherungsschutzBeginn)}"/>
						<sciphox:VersicherungsschutzEnde V="${escXml(versicherung.versicherungsschutzEnde)}"/>
						<sciphox:Einlesedatum V="${escXml(versicherung.einlesedatum)}"/>
					</sciphox:GesetzlicheKrankenversicherung>
				</sciphox:sciphox-ssu>
			</local_header>
		</patient>
	</clinical_document_header>
	<body>
		<section>${paragraph(
    'Administrative Daten',
    textBeob('Einschreibung wegen', administrative.einschreibungWegen)
  )}${paragraph(
    'Anamnese- und Befunddaten',
    wertBeob('Körpergröße', anamnese.koerpergroesse, 'm') +
      wertBeob('Körpergewicht', anamnese.koerpergewicht, 'kg') +
      wertBeob('Blutdruck systolisch', anamnese.blutdruckSystolisch, 'mmHg') +
      wertBeob('Blutdruck diastolisch', anamnese.blutdruckDiastolisch, 'mmHg') +
      textBeob('Raucher', anamnese.raucher) +
      textBeob('Begleiterkrankungen', anamnese.begleiterkrankungen) +
      wertBeob('Aktuelle Krankheitsaktivität - DAS-28-Wert', anamnese.das28Wert, '{Punktzahl}') +
      textBeob(
        'Erkrankungsdauer der rheumatoiden Arthritis (zum Zeitpunkt der aktuellen Dokumentation)',
        anamnese.erkrankungsdauer
      ) +
      textBeob('Klinische Einschätzung des Osteoporoserisikos durchgeführt', anamnese.osteoporoserisiko)
  )}${paragraph(
    'Medikamentöse und sonstige Maßnahmen',
    textBeob('Aktuelle Glukokortikoidtherapie wegen rheumatoider Arthritis', medikamentoes.glukokortikoidtherapie) +
      textBeob('Aktuelle DMARD-Therapie', medikamentoes.dmardTherapie) +
      textBeobMulti('Regelmäßige körperliche Aktivität', medikamentoes.koerperlicheAktivitaet)
  )}${paragraph('Schulung', schulungBeob)}${paragraph(
    'Behandlungsplanung',
    textBeob('Vom Patienten gewünschte Informationsangebote der Krankenkasse', behandlungsplanung.informationsangebote) +
      textBeob('Dokumentationsintervall', behandlungsplanung.dokumentationsintervall)
  )}
		</section>
	</body>
</levelone>`;
}

export function downloadXml(doc: DmpDocument, filename?: string): void {
  const xml = serializeToXml(doc);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `${doc.bsnr}_${doc.setId}_${doc.serviceDate.replace(/-/g, '')}.${doc.documentType === 'EE' ? 'EERA' : 'EVRA'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
