# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

eDMP Rheumatoide Arthritis — a web application for creating, editing, and submitting Disease Management Programme (DMP) documentation per KBV/HL7 Sciphox standard. Documents are CDA-based XML files with extensions `.EERA` (Erstdokumentation) and `.EVRA` (Verlaufsdokumentation).

The repository has two components:
- `frontend/` — React/TypeScript (Vite) — already implemented
- `backend/` — Java/Spring Boot + PostgreSQL — to be built (see `backend.md`)

## Frontend Commands

All commands run from the `frontend/` directory:

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # type-check (tsc -b) then Vite bundle
npm run lint      # ESLint
```

No test framework is configured yet.

## Frontend Architecture

### Data flow

1. User loads a `.EERA`/`.EVRA` file or creates a blank doc → `xmlParser.ts` → `DmpDocument`
2. User edits the form (section components read/write `DmpDocument` via `onChange`)
3. On export/submit → `validation.ts` runs 9 Plausibility rules → `xmlSerializer.ts` → XML string
4. "Ans Backend senden" POSTs raw XML to `/api/dmp/submit` (`Content-Type: application/xml`)

### Key files

| File | Purpose |
|---|---|
| `src/types/dmp.ts` | Core domain model (`DmpDocument` and all sub-types) |
| `src/lib/xmlParser.ts` | Sciphox CDA XML → `DmpDocument` (fast-xml-parser v5, ISO-8859-15 encoding) |
| `src/lib/xmlSerializer.ts` | `DmpDocument` → Sciphox CDA XML string |
| `src/lib/validation.ts` | 9 plausibility rules from Anlage 22 DMP-A-RL |
| `src/data/schemaValues.ts` | Enum values sourced from `ErgebnistexteRA.xsd` / `ParameterRA.xsd` |
| `src/lib/emptyDocument.ts` | Factory for blank EE/EV documents |

### XML parsing notes

- `fast-xml-parser` v5 keeps namespace prefixes in key names even with `ignoreNameSpace: true` — all Sciphox elements are accessed as `sciphox:<name>` keys.
- Files on disk are ISO-8859-15 encoded; the parser decodes via `TextDecoder('iso-8859-15')`.
- Clinical data lives inside nested `paragraph → content → local_markup → sciphox:sciphox-ssu → sciphox:Beobachtungen` structures; `getParagraphBeobachtungen()` abstracts this lookup.

### Vite proxy (not yet configured)

`vite.config.ts` has no `/api` proxy. Before connecting to the local backend, add:
```ts
server: { proxy: { '/api': 'http://localhost:8080' } }
```

## Backend Specification (backend.md summary)

- **Stack**: Spring Boot, Spring Data JPA + Hibernate, PostgreSQL (`Data-AL` database)
- **Table**: `dmpdoku` — columns: `id` (UUID PK), `pnr`, `type`, `fall`, `service_tmr`, `origination_dttm`, `quartal`, `lanr`, `bsnr`, `ik`, `xml`
- **Schema management**: Flyway (auto-create + migrations)
- **API**: CRUD REST; POST body is JSON with `xml` field base64-encoded → stored decoded

**Discrepancy**: The frontend currently sends raw XML (`Content-Type: application/xml`) to `/api/dmp/submit`, but `backend.md` specifies JSON with base64 XML. When implementing the backend, either align the frontend to send JSON+base64 or accept raw XML — coordinate this before implementing.

## Domain Reference

- `Schema/` — XSD schemas for the Sciphox CDA format
- `sample/` — example `.EERA` and `.EVRA` files for testing
- `Plausi_eDMP_Rheuma.pdf` — source document for the 9 validation rules in `validation.ts`
