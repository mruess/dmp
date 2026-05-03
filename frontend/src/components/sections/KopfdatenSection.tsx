import type { Provider, Patient, Versicherung } from '../../types/dmp';
import { FormField, Input } from '../ui/FormField';
import { GESCHLECHT } from '../../data/schemaValues';

interface Props {
  provider: Provider;
  patient: Patient;
  versicherung: Versicherung;
  serviceDate: string;
  originationDate: string;
  id: string;
  setId: string;
  versionNbr: string;
  onProviderChange: (p: Provider) => void;
  onPatientChange: (p: Patient) => void;
  onVersicherungChange: (v: Versicherung) => void;
  onFieldChange: (field: string, value: string) => void;
}

export function KopfdatenSection({
  provider, patient, versicherung, serviceDate, originationDate, id, setId, versionNbr,
  onProviderChange, onPatientChange, onVersicherungChange, onFieldChange,
}: Props) {
  const prov = (patch: Partial<Provider>) => onProviderChange({ ...provider, ...patch });
  const pat = (patch: Partial<Patient>) => onPatientChange({ ...patient, ...patch });
  const vers = (patch: Partial<Versicherung>) => onVersicherungChange({ ...versicherung, ...patch });

  return (
    <div className="section-content">
      {/* Dokumentmetadaten */}
      <div className="subsection">
        <h3 className="subsection-title">Dokumentdaten</h3>
        <div className="form-grid">
          <FormField label="Dokument-ID">
            <Input value={id} onChange={(v) => onFieldChange('id', v)} placeholder="1" />
          </FormField>
          <FormField label="Set-ID (Patienten-ID)">
            <Input value={setId} onChange={(v) => onFieldChange('setId', v)} />
          </FormField>
          <FormField label="Version">
            <Input value={versionNbr} onChange={(v) => onFieldChange('versionNbr', v)} placeholder="1" />
          </FormField>
          <FormField label="Dokumentationsdatum">
            <Input value={serviceDate} type="date" onChange={(v) => onFieldChange('serviceDate', v)} />
          </FormField>
          <FormField label="Datum der Unterschrift">
            <Input value={originationDate} type="date" onChange={(v) => onFieldChange('originationDate', v)} />
          </FormField>
        </div>
      </div>

      {/* Arztdaten */}
      <div className="subsection">
        <h3 className="subsection-title">Arztdaten</h3>
        <div className="form-grid">
          <FormField label="BSNR" required>
            <Input value={provider.bsnr} onChange={(v) => prov({ bsnr: v })} placeholder="278012389" />
          </FormField>
          <FormField label="LANR" required>
            <Input value={provider.lanr} onChange={(v) => prov({ lanr: v })} placeholder="274343489" />
          </FormField>
          <FormField label="Vorname">
            <Input value={provider.name.vorname} onChange={(v) => prov({ name: { ...provider.name, vorname: v } })} />
          </FormField>
          <FormField label="Nachname">
            <Input value={provider.name.nachname} onChange={(v) => prov({ name: { ...provider.name, nachname: v } })} />
          </FormField>
          <FormField label="Titel (akad.)">
            <Input value={provider.name.titel} onChange={(v) => prov({ name: { ...provider.name, titel: v } })} placeholder="Dr. med." />
          </FormField>
          <FormField label="Adelstitel">
            <Input value={provider.name.namenszusatz} onChange={(v) => prov({ name: { ...provider.name, namenszusatz: v } })} />
          </FormField>
          <FormField label="Vorsatz">
            <Input value={provider.name.vorsatz} onChange={(v) => prov({ name: { ...provider.name, vorsatz: v } })} placeholder="von" />
          </FormField>
          <FormField label="Straße">
            <Input value={provider.adresse.strasse} onChange={(v) => prov({ adresse: { ...provider.adresse, strasse: v } })} />
          </FormField>
          <FormField label="Hausnummer">
            <Input value={provider.adresse.hausnummer} onChange={(v) => prov({ adresse: { ...provider.adresse, hausnummer: v } })} />
          </FormField>
          <FormField label="PLZ">
            <Input value={provider.adresse.plz} onChange={(v) => prov({ adresse: { ...provider.adresse, plz: v } })} />
          </FormField>
          <FormField label="Ort">
            <Input value={provider.adresse.ort} onChange={(v) => prov({ adresse: { ...provider.adresse, ort: v } })} />
          </FormField>
          <FormField label="Telefon">
            <Input value={provider.telefon} onChange={(v) => prov({ telefon: v })} placeholder="tel:(0221)1234-0" />
          </FormField>
        </div>
      </div>

      {/* Patientendaten */}
      <div className="subsection">
        <h3 className="subsection-title">Patientendaten</h3>
        <div className="form-grid">
          <FormField label="Patienten-ID">
            <Input value={patient.patientId} onChange={(v) => pat({ patientId: v })} />
          </FormField>
          <FormField label="Vorname">
            <Input value={patient.name.vorname} onChange={(v) => pat({ name: { ...patient.name, vorname: v } })} />
          </FormField>
          <FormField label="Nachname">
            <Input value={patient.name.nachname} onChange={(v) => pat({ name: { ...patient.name, nachname: v } })} />
          </FormField>
          <FormField label="Geburtsdatum">
            <Input value={patient.geburtsdatum} type="date" onChange={(v) => pat({ geburtsdatum: v })} />
          </FormField>
          <FormField label="Geschlecht">
            <select
              className="form-select"
              value={patient.geschlecht}
              onChange={(e) => pat({ geschlecht: e.target.value })}
            >
              <option value="">– bitte wählen –</option>
              {GESCHLECHT.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Straße">
            <Input value={patient.adresse.strasse} onChange={(v) => pat({ adresse: { ...patient.adresse, strasse: v } })} />
          </FormField>
          <FormField label="Hausnummer">
            <Input value={patient.adresse.hausnummer} onChange={(v) => pat({ adresse: { ...patient.adresse, hausnummer: v } })} />
          </FormField>
          <FormField label="PLZ">
            <Input value={patient.adresse.plz} onChange={(v) => pat({ adresse: { ...patient.adresse, plz: v } })} />
          </FormField>
          <FormField label="Ort">
            <Input value={patient.adresse.ort} onChange={(v) => pat({ adresse: { ...patient.adresse, ort: v } })} />
          </FormField>
          <FormField label="Land">
            <Input value={patient.adresse.land} onChange={(v) => pat({ adresse: { ...patient.adresse, land: v } })} placeholder="DEU" />
          </FormField>
        </div>
        <div className="subsection-sub">
          <h4>Postanschrift (optional)</h4>
          <div className="form-grid">
            <FormField label="Postfach">
              <Input value={patient.postfach} onChange={(v) => pat({ postfach: v })} />
            </FormField>
            <FormField label="PLZ (Post)">
              <Input value={patient.plzPostal} onChange={(v) => pat({ plzPostal: v })} />
            </FormField>
            <FormField label="Ort (Post)">
              <Input value={patient.ortPostal} onChange={(v) => pat({ ortPostal: v })} />
            </FormField>
            <FormField label="Land (Post)">
              <Input value={patient.landPostal} onChange={(v) => pat({ landPostal: v })} placeholder="DEU" />
            </FormField>
          </div>
        </div>
      </div>

      {/* Versicherungsdaten */}
      <div className="subsection">
        <h3 className="subsection-title">Versicherungsdaten</h3>
        <div className="form-grid">
          <FormField label="Kostenträger">
            <Input value={versicherung.kostentraegerbezeichnung} onChange={(v) => vers({ kostentraegerbezeichnung: v })} />
          </FormField>
          <FormField label="Kostenträgerkennung (IK)">
            <Input value={versicherung.kostentraegerkennung} onChange={(v) => vers({ kostentraegerkennung: v })} />
          </FormField>
          <FormField label="Abrechnungsbereich">
            <Input value={versicherung.abrechnungsbereich} onChange={(v) => vers({ abrechnungsbereich: v })} placeholder="00" />
          </FormField>
          <FormField label="WOP">
            <Input value={versicherung.wop} onChange={(v) => vers({ wop: v })} placeholder="01" />
          </FormField>
          <FormField label="Versichertennummer">
            <Input value={versicherung.versichertennummer} onChange={(v) => vers({ versichertennummer: v })} />
          </FormField>
          <FormField label="Versichertenart">
            <Input value={versicherung.versichertenart} onChange={(v) => vers({ versichertenart: v })} placeholder="1" />
          </FormField>
          <FormField label="Besondere Personengruppe">
            <Input value={versicherung.besonderePersonengruppe} onChange={(v) => vers({ besonderePersonengruppe: v })} />
          </FormField>
          <FormField label="DMP-Kennzeichnung">
            <Input value={versicherung.dmpKennzeichnung} onChange={(v) => vers({ dmpKennzeichnung: v })} />
          </FormField>
          <FormField label="Versicherungsschutz Beginn">
            <Input value={versicherung.versicherungsschutzBeginn} type="date" onChange={(v) => vers({ versicherungsschutzBeginn: v })} />
          </FormField>
          <FormField label="Versicherungsschutz Ende">
            <Input value={versicherung.versicherungsschutzEnde} type="date" onChange={(v) => vers({ versicherungsschutzEnde: v })} />
          </FormField>
          <FormField label="Einlesedatum">
            <Input value={versicherung.einlesedatum} type="date" onChange={(v) => vers({ einlesedatum: v })} />
          </FormField>
        </div>
      </div>
    </div>
  );
}
