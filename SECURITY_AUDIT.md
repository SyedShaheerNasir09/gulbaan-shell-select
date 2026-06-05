# 🔐 Security Audit — Gulbaan · Shell Select Store

**Date:** 2026-06-05
**Scope:** Entire repository at `C:\gulbaan-catalogue` (excluding `node_modules/` and `.next/` build output)
**Result:** ✅ **PASS — safe to push.** No secrets are or were ever committed.

---

## 1. Methodology

- Pattern-scanned every file for: Sanity tokens, GitHub tokens (`ghp_`, `github_pat_`,
  `gho_`), AWS keys (`AKIA…`), Slack tokens (`xox…`), JWTs (`eyJ….….`), RSA/EC private
  keys, and generic `token|secret|password|api_key = "…"` assignments.
- Verified all sensitive values resolve from `process.env` only.
- Confirmed git history state and what would be committed (`git ls-files`, `git check-ignore`).

## 2. Secrets found

| Secret | Location | Committed? | Status |
|--------|----------|-----------|--------|
| `SANITY_API_WRITE_TOKEN` (Sanity Editor token) | `.env.local` only | **No** | ✅ Git-ignored, never tracked |

- The token value (`sk…`, 180 chars) was found in **exactly one file: `.env.local`**, which
  is git-ignored and was **never** added to git (the repo had no prior history).
- No other secret types (GitHub/AWS/Slack/JWT/private keys) were found anywhere.

### Non-secret values (safe, by design)
| Value | Why it's not a secret |
|-------|------------------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` (`77bemy3b`) | `NEXT_PUBLIC_*` values are intentionally exposed to the browser; the Sanity project id is public. Found only in `.env.local`. |
| `NEXT_PUBLIC_SANITY_DATASET` (`production`) | Public dataset name. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL. |

## 3. Secrets removed

**None required.** No secret was ever committed (git was uninitialised), and all secrets
were already correctly externalised to environment variables. Nothing had to be scrubbed
from source or history.

## 4. Environment-variable hygiene

- ✅ `scripts/import-catalog.ts` and `scripts/migrate-single-store.ts` read the token via
  `process.env.SANITY_API_WRITE_TOKEN` — no hardcoding.
- ✅ `src/sanity/env.ts` / `client.ts` read project id/dataset from `process.env`.
- ✅ `src/components/Analytics.tsx` reads GA/Clarity ids from `process.env`.
- ✅ `.env.local.example` contains **placeholders only** (`your_project_id`, `your_write_token`).
- ✅ `README.md`, `package.json`, `package-lock.json`, `sanity.config.ts`, `sanity.cli.ts`,
  `next.config.mjs` — scanned, **no credentials**.

## 5. Files / paths ignored (`.gitignore`)

```
node_modules/            .next/  out/  build/  dist/
.env  .env.*  (everything)   →  EXCEPT  .env.example, .env.local.example
*.pem  *.key  *.p12  *.pfx  secrets.json  credentials.json
.vercel
coverage/
*.log  (+ npm/yarn/pnpm debug logs)
*.tsbuildinfo  next-env.d.ts
.DS_Store  Thumbs.db  *.swp
```

Confirmed via `git check-ignore`: `.env`, `.env.local`, `.env.production`,
`.env.development` are all ignored; `.env.local.example` is intentionally tracked.

## 6. What will be committed

62 files: application source (`src/`), Sanity schemas/config, import & migration scripts,
build config (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`,
`postcss.config.mjs`), `README.md`, `SECURITY_AUDIT.md`, `.env.local.example`, `.gitignore`.
**Not** committed: `.env.local`, `node_modules/`, `.next/`.

## 7. Risk assessment

| Area | Risk | Notes |
|------|------|-------|
| Committed secrets | 🟢 None | No secret in tracked files; no git history existed |
| Secret handling | 🟢 Low | All via `process.env`; `.env.local` git-ignored |
| Public env values | 🟢 Low | Only `NEXT_PUBLIC_*` (designed to be public) |
| Build artifacts / deps | 🟢 None | `node_modules`, `.next` ignored |

**Overall: 🟢 LOW RISK — repository is clean and safe to publish.**

### Recommendations
1. **Rotate the Sanity write token** after the initial import/migration — the public site
   only needs the public project id to read. (Manage → API → Tokens → revoke & recreate as needed.)
2. In **Vercel**, set env vars in the dashboard (never commit them). The write token is
   **not** needed in production hosting — only locally for the import scripts.
3. Keep `.env.local` local. Share config via `.env.local.example` only.
