# Gulbaan · Shell Select Store 🌸

A **premium digital flower catalogue** for Gulbaan products available at the **Shell
Select store**. This is **not** an e-commerce site — there is **no cart, no checkout,
no online ordering**. It's a warm, floral, editorial discovery experience.

> **For the sales team:** open **`/studio`**, sign in with your invited Sanity account,
> and you can add/edit products, swap images, write descriptions, change prices, save
> drafts, and add/edit/remove collections — no developer needed. See
> [_For the sales team_](#-for-the-sales-team-no-code) below.

Built with **Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion ·
Sanity CMS**, deployable to **Vercel**.

---

## ✨ What you get

- **Landing page** with two cards — _Shell Select Store_ (enters the catalogue) and a
  disabled _Coming Soon_ card.
- **Catalogue** with live search, category filters, featured products and a responsive
  gallery grid.
- **Product pages** with a large image gallery, full description, price, category and
  related products.
- **Category pages**.
- **Embedded Sanity Studio** at `/studio` so the sales team can edit descriptions,
  change prices, upload images, create products, save drafts and publish — **no
  developer needed**.
- **Import script** that reads your local `C:\catalog\` folder, parses each
  `description.txt`, uploads images and creates products + categories automatically.

---

## 🗂 Project structure

```
gulbaan-catalogue/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                 # Landing page (two cards)
│  │  ├─ layout.tsx               # Root layout + fonts
│  │  ├─ globals.css              # Design system / Tailwind
│  │  ├─ store/page.tsx           # Catalogue (search, filters, grid)
│  │  ├─ product/[slug]/page.tsx  # Product detail
│  │  ├─ category/[slug]/page.tsx # Category listing
│  │  ├─ studio/[[...tool]]/page.tsx # Embedded Sanity Studio (/studio)
│  │  └─ not-found.tsx
│  ├─ components/                 # Navbar, Footer, ProductCard, ImageGallery, …
│  ├─ sanity/                     # client, image, queries, env, schemas, structure
│  └─ lib/                        # types, utils
├─ scripts/
│  └─ import-catalog.ts           # C:\catalog  ➜  Sanity importer
├─ sanity.config.ts               # Studio config
├─ .env.local.example             # Copy to .env.local
└─ package.json
```

---

## ✅ Prerequisites

- **Node.js 18.18+** (Node 20 LTS recommended) — check with `node -v`
- A free **Sanity account** → https://www.sanity.io
- Your product folders in **`C:\catalog\`** (already generated)

---

## 🚀 Setup (step by step)

> Commands below are for **Windows PowerShell**. Run them from the project folder:
> `cd C:\gulbaan-catalogue`

### 1) Install dependencies

```powershell
npm install
```

> If you hit a peer-dependency error, use:
> `npm install --legacy-peer-deps`

### 2) Create a Sanity project & token

1. Go to **https://www.sanity.io/manage** and **create a new project**
   (any name, dataset = **`production`**).
2. Copy the **Project ID** (looks like `ab12cd34`).
3. In the project: **API → CORS origins → Add origin** → add
   `http://localhost:3000` (tick _Allow credentials_). Add your Vercel URL later too.
4. **API → Tokens → Add API token** → name it `import`, permission **Editor** →
   copy the token (you only see it once).

### 3) Create your `.env.local`

```powershell
Copy-Item .env.local.example .env.local
notepad .env.local
```

Fill in:

```ini
NEXT_PUBLIC_SANITY_PROJECT_ID=ab12cd34
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
SANITY_API_WRITE_TOKEN=your_editor_token
CATALOG_PATH=C:\\catalog

# Used to generate the in-store QR codes at /qr
NEXT_PUBLIC_SITE_URL=https://shellselect.gulbaan.com

# Analytics (optional — only load if set)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

### 4) Import the catalogue

First do a **dry run** (no writes — just shows what will be imported):

```powershell
npm run import:dry
```

You should see all **31 products**, **8 categories**, **113 images**. When happy:

```powershell
npm run import
```

- Re-running is safe: existing products are **skipped** (so manual edits in Studio are
  preserved).
- To force a clean re-import that overwrites products: `npm run import:force`.

### 5) Run the site

```powershell
npm run dev
```

- Website → **http://localhost:3000**
- Studio → **http://localhost:3000/studio**

---

## 🧑‍🌾 For the sales team (no code)

**Give a salesperson access (one-time):** go to **https://www.sanity.io/manage** → your
project → **Members** → **Invite member** → enter their email → role **Editor** (or
**Viewer** for read-only). They accept the email, then open **`/studio`** on the website
and sign in. No install, no developer.

Everything is editable at **`/studio`**:

| Task | Where |
|------|-------|
| Change a price | Products → open product → **Pricing** tab |
| Edit a description | Products → **Content** tab |
| Upload / reorder images | Products → **Images** tab |
| Create a new product | Products → **＋** (slug auto-generates from the name) |
| Save as draft (hidden) | Products → **Visibility** → _Status_ = **Draft** |
| Move through approval | Products → **Visibility** → _Status_: Draft → Approved for Shell → Live |
| Feature on the catalogue | **Visibility** → _Featured Product_ on |
| Add / edit / remove a collection | **Collections** (hand-pick products into a set) |
| Run a campaign banner | **Promotions** (title, dates, button — auto shows/hides by date) |
| Edit the store address | **Store Locations** → _Shell Select_ |
| Add a testimonial | **Testimonials** |
| Curate a collection | **Collections** (hand-pick products) |
| Edit landing text / florist note | **Homepage** |
| Availability message, contact, logo | **Site Settings** |
| Turn on the B2B page | **Corporate / B2B** → _Enabled_ |

> ### 🚦 Approval workflow (prevents accidental publishing)
> Every product has a **Status**: **Draft → Approved for Shell → Live**.
> A product appears on the website **only when Status = 🌿 Live**. Sales staff can
> safely build products as *Draft*, mark them *Approved for Shell* for review, and
> only a final *Live* makes them public.

---

## ☁️ Deploy to Vercel

1. Push this folder to a **GitHub** repo:

   ```powershell
   git init
   git add .
   git commit -m "Gulbaan Shell Select catalogue"
   git branch -M main
   git remote add origin https://github.com/<you>/gulbaan-catalogue.git
   git push -u origin main
   ```

2. Go to **https://vercel.com/new**, import the repo.
3. Add the **Environment Variables** (same as `.env.local`, **except** you can omit
   `SANITY_API_WRITE_TOKEN` in production — it's only needed by the import script):

   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`

4. **Deploy.** Your site is live at `https://<project>.vercel.app`
   and the Studio at `https://<project>.vercel.app/studio`.
5. Back in **Sanity → API → CORS origins**, add your Vercel URL (with _Allow
   credentials_) so the Studio works in production.

> Content updates in Studio appear on the site within ~60s (ISR revalidation), or
> instantly on the next deploy/visit.

---

## 📝 Notes

- **HEIC images:** _Bag of Bloom_ ships 3 Apple `.heic` photos. They upload fine and
  are auto-converted to web formats by Sanity's image pipeline (`?fm=jpg/auto`). If you
  prefer, replace them with `.jpg` in Studio.
- **The catalogue path** is configurable via `CATALOG_PATH` in `.env.local`.
- **Re-importing** never deletes anything; it skips existing products unless you use
  `import:force`.
- **No checkout by design** — product pages show a "visit a Shell Select store" note
  instead of a buy button.

---

## 🧭 Routes

| Path | Description |
|------|-------------|
| `/` | Landing page (two cards + Shell branding) |
| `/store` | Full catalogue (search + filters, promos, testimonials) |
| `/store?qr=1` | Catalogue with in-store QR welcome (QR target) |
| `/product/[slug]` | Product detail + "Available at Shell Select" |
| `/category/[slug]` | Category listing |
| `/stores` | Find a Shell Select store (locator) |
| `/qr` | Printable in-store QR codes (staff utility, noindex) |
| `/corporate` | B2B / corporate gifting (hidden until enabled) |
| `/studio` | Sanity Studio (content editing) |

---

## 🐚 Shell Select features

- **Co-branding** — "Gulbaan × Shell Select" lockup in the nav, landing, footer and
  product pages, plus availability messaging everywhere.
- **Single Shell Select store** — every product shows **"Available at Shell Select"** with
  the store's address, sourced from the one **Store Location** doc (edit its address in
  Studio). The site copy is singular throughout ("the Shell Select store").
- **Promotions** — date-bound campaign banners (e.g. "Father's Day Collection") that
  appear/disappear automatically.
- **Store locator** — `/stores` page + a locator card on the catalogue with a
  "Get directions" link.
- **Testimonials & Collections** — social proof and curated product sets.
- **Corporate / B2B** — a ready-to-go gifting page kept hidden until you flip *Enabled*.

## 📈 Analytics & QR (built for in-store traffic)

- **GA4 + Microsoft Clarity** load automatically when `NEXT_PUBLIC_GA_ID` /
  `NEXT_PUBLIC_CLARITY_ID` are set. Custom events are tracked out of the box:
  `view_item` (product views), `search` (search terms), `view_item_list` (category
  views), `select_promotion`, `find_store`, and `qr_entry` — so you can see your
  **most-viewed bouquets, most-searched products and top categories** from day one.
- **QR mode** — most visitors arrive by scanning a code in a Shell store, so the catalogue
  is **mobile-first** and `?qr=1` shows an in-store welcome. Print codes from **`/qr`**.
- **Subdomain** — point **`shellselect.gulbaan.com`** at the Vercel deployment (add it as
  a domain in Vercel + a CNAME in DNS), set `NEXT_PUBLIC_SITE_URL` to it, and the `/qr`
  codes will target the right place. Put those QR codes beside in-store displays.

Made with 🌷 for the Shell Select ecosystem.
