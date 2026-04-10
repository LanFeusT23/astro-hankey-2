# Jonathan Hankey Astrophotography Portfolio

A NuxtJS 3 + Vue 3 + Tailwind CSS 4 astrophotography portfolio website featuring a landing page, image gallery with lightbox, and admin dashboard.

## Features

- **Home** — Animated star field, hero section with shimmer title
- **Gallery** — Responsive image grid with hover overlays and lightbox modal
- **Admin** — Protected CRUD dashboard with image upload, edit, and delete
- **Auth** — Google Sign-In via Firebase (stub fallback for local dev)
- **Repository pattern** — Swap between Stub, Firebase, or AWS backends via env var

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

See `.env.example` for all variables. Key ones:

| Variable | Description |
|---|---|
| `NUXT_IMAGE_REPOSITORY` | Backend: `stub` \| `firebase` \| `aws` |
| `NUXT_APP_BASE_URL` | Base URL (e.g. `/astro-hankey-2/` for GitHub Pages) |
| `NUXT_PUBLIC_FIREBASE_*` | Firebase config (required for `firebase` backend + Google Auth) |

## Architecture

```
app/
├── pages/          # index, gallery, admin/index, admin/login
├── components/     # AppNav, ImageCard, ImageModal, AdminImageList
├── composables/    # useImages, useAuth
├── middleware/     # auth (protects /admin)
├── repositories/   # ImageRepository interface + Stub/Firebase/AWS impls
└── types/          # AstroImage type
```

## Deployment

GitHub Actions workflows deploy to GitHub Pages on push to `main` (production) or `develop` (staging). See `.github/workflows/`.

```bash
npm run generate   # Static site output → .output/public
```

