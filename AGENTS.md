# AGENTS.md

## Cursor Cloud specific instructions

### Project skills
- Senior ETL / Data Testing 360° interview coach lives at
  `.cursor/skills/senior-etl-data-testing-360-interview/SKILL.md`.
- When the user pastes a job description, recruiter message, role requirements,
  or asks for ETL/data-testing interview prep, read and follow that skill
  immediately (invoke as `/senior-etl-data-testing-360-interview`).

### Repository state
This repository (`MCP-Validation1`) includes the Agent SDK project
`marketplace-flip-coach/` (local Marketplace flipping coach). Root still has
no Python app dependency manifest.

### marketplace-flip-coach
- Path: `marketplace-flip-coach/`
- Install: `cd marketplace-flip-coach && npm install`
- Validate: `npx --yes "@grok/agent-sdk@0.6.0" validate --dir marketplace-flip-coach`
- Typecheck: `cd marketplace-flip-coach && npx tsc --noEmit`
- Playground: `npx --yes "@grok/agent-sdk@0.6.0" dev --dir marketplace-flip-coach`
  (requires Cursor login / `CURSOR_API_KEY` for model turns)

### Toolchain
- Python 3.12 is preinstalled. `pip` works directly (not PEP 668 externally-managed).
- Node.js 22+ is required for `marketplace-flip-coach`.

### When Python deps are added
- If a root `requirements.txt` appears, install with `pip install -r requirements.txt`.
- If a `pyproject.toml` appears, install with `pip install -e .` (or `uv sync` if a
  `uv.lock` is present and `uv` is installed).
