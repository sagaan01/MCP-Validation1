# AGENTS.md

## Cursor Cloud specific instructions

### Repository state
This repository (`MCP-Validation1`) is currently a bare scaffold for learning MCP
(Model Context Protocol). As of this writing it contains only `README.md` and a
Python-oriented `.gitignore` — there is **no application code, dependency manifest,
tests, or build configuration yet**. There is therefore nothing to build, run, or
test until source code is added.

### Toolchain
- Python 3.12 is preinstalled and is the intended language (the `.gitignore` is the
  standard Python template). `pip` works directly (the system Python is not
  PEP 668 externally-managed in this environment).
- Node.js is also available if a JS/TS MCP server is added later.

### When code is added
- If a `requirements.txt` appears, install it with `pip install -r requirements.txt`.
- If a `pyproject.toml` appears, install with `pip install -e .` (or `uv sync` if a
  `uv.lock` is present and `uv` is installed).
- The startup update script is intentionally guarded to be a no-op while the repo
  has no dependency manifest, and will begin installing dependencies automatically
  once a `requirements.txt` is committed.
