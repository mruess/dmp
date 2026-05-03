# Backend

## Architektur

Das Backend ist ein Java/Springboot Projekt mit einer Postgres Datenbank.
Das Frontend ist bereits im Verzeichnis: frontend in React/Typescript implementiert.

## Zweck

### Schritt 1
- Sciphox CDA Dateien aus dem Frontend entgegennehmen. Die XML Datei wird in Postgres gespeichert.
- Das Frontend kann die Dateien speichern und darstellen, ändern und löschen.

### Schritt 2
- Das Frontend kann eine Liste von Dokumentationen anfordern, die gewissen Filterbedingungen entsprechen

### Schritt 3
- Schnittstelle zum KBV-Prüfmodul

### Schritt 4
- Schnittstelle zu KIM um die Dokumentationen an die Sammelstelle zu übertragen

## Datenbank

- Als Datenbank wird Postgres verwendet.

Name der Datenbank in Postgres: Data-AL

Aufbau der Tabelle dmpdoku

- Patientennummer (pnr)
- DMP-Typ (type )
- Fallnummer (fall)
- Erstellungsdatum (service_tmr)
- Dokumentationsdatum/Zeit (origination_dttm)
- Quartal (quartal)
- LANR (lanr)
- BSNR (BSNR)
- IK (ik)
- xml (xml)

als primary Key wird eine uuid verwendet

Als Schnittstelle zu Datenbank dient Spring Data JPA + Hibernate

Es wird ein Mechanismus implementiert um die Tabelle dmpdoku anzulegen falls sie nicht vorhanden ist und Migrationen automatisch durchführen zu können..

Die RestAPI arbeitet nach dem CRUD Prinzip. Zusätzlich wird in Schritt 2 eine Liste mit Filterbedingungen im Api gepflegt

Bei einer Create Operation (POST) wird der Datensatz als JSON im Body übergeben, das Feld xml ist dabei base64 codiert. Zur besseren Lesbarkeit wird das XML bei Speichern in die Datenbank decodiert. Die REST-API übermittelt als Result die ID des Datensatzes.
