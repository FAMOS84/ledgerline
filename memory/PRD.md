# Insurance Benefits Summarizer — PRD

## Original Problem Statement
> I need an app that different style attachments can be dropped into a attachment drop zone and the contents of the files will be summarized creating a executive overview of everything. This app will focus on insurance benefits specifically Dental, Vision, Basic Life, Voluntary Life, STD & LTD. So we will be extracting the plan design, the rates, and the coverages.

## User Choices (confirmed Feb 2026)
- File types: PDF, DOCX, XLSX, PNG/JPG images
- LLM: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) via Emergent Universal LLM Key
- Output: On-screen dashboard + Excel export
- Auth: Simple PIN login. PIN = `1497412781`

## Target Users
- Benefits brokers, HR advisors, and insurance professionals who receive carrier proposals, rate sheets, SBCs, and benefits summaries and need a fast executive-level comparison across Dental / Vision / Basic Life / Voluntary Life / STD / LTD.

## Architecture
- **Frontend**: React 19 (CRA), TailwindCSS, Shadcn UI (sharp-edged Swiss/editorial aesthetic), Playfair Display + IBM Plex Sans + JetBrains Mono typography, sonner for toasts, lucide-react for icons.
- **Backend**: FastAPI + Motor (Mongo), emergentintegrations (Claude Sonnet 4.5), pdfplumber / python-docx / openpyxl / pytesseract for multi-format text extraction. JWT auth.
- **Storage**: MongoDB `analyses` collection.
- **Auth**: PIN → JWT (7-day). `Authorization: Bearer <token>` header. Export endpoint accepts `?token=` for browser download.

## Implemented (Feb 24, 2026)
### Backend
- `POST /api/auth/pin` — PIN → JWT token
- `GET /api/auth/me` — validate token
- `POST /api/analyze` — multipart upload → multi-format text extraction → Claude Sonnet 4.5 structured JSON extraction → persisted to Mongo
- `GET /api/analyses` — list history
- `GET /api/analyses/{id}` — fetch full analysis
- `DELETE /api/analyses/{id}` — delete
- `GET /api/analyses/{id}/export?token=` — XLSX export (Overview + 6 benefit sheets)

### Frontend
- `/login` — editorial PIN screen with masthead + grid paper
- `/` — Protected dashboard:
  - Hero drop zone (drag/drop + browse, accepts PDF/DOCX/XLSX/PNG/JPG)
  - Attached files list with per-file remove + clear all
  - Animated "Analyzing…" typewriter + indeterminate progress bar
  - Executive Summary panel (title, effective date, carriers, coverage chips, summary text)
  - 6 benefit tabs (Dental / Vision / Basic Life / Voluntary Life / STD / LTD) each with Plan Design, Rates, Coverages tables
  - Export to Excel
  - History sidebar (select/delete past analyses)
  - Logout

## Testing Results
- Backend pytest: **16/16 passed** (auth, real Claude call, CRUD, Excel export)
- Frontend Playwright: **100%** (login flows, drag/drop, analyze, tabs, export, history, logout)

## Prioritized Backlog
### P1
- [ ] Side-by-side comparison of 2+ analyses (ideal for renewals vs. marketing)
- [ ] Per-line comparison view (e.g., compare dental across 3 carriers)
- [ ] Inline data editing — let broker correct extracted fields before export

### P2
- [ ] Bulk rename / tag analyses (client folders)
- [ ] PDF export of executive summary (branded one-pager)
- [ ] Share read-only link for an analysis
- [ ] Admin: rotate PIN from UI
- [ ] Rate limiting on `/api/auth/pin` (brute force hardening)
- [ ] Blob-based Excel download using Authorization header instead of `?token=` query param

## Known Limitations
- Single-user PIN auth (intentional per user choice)
- OCR quality on complex image tables is limited (tesseract); screenshots from clean PDFs/digital documents work best
