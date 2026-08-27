# DAce — Local Development Setup

## Prerequisites

- Node.js 20+
- A PostgreSQL database (we use Neon)
- A Clerk account for authentication

## Environment Variables

Copy `.env.example` to `.env.local` and `.env`, then fill in real values.

### Database

| Variable       | Where to get it                                                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | Neon dashboard → Connection Details → use the **pooled** connection string for the app, **direct** connection string only when running `prisma migrate` locally |

### Clerk Authentication

| Variable                                       | Where to get it                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`            | Clerk dashboard → API Keys → Publishable key                            |
| `CLERK_SECRET_KEY`                             | Clerk dashboard → API Keys → Secret key                                 |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                | Fixed value: `/sign-in`                                                 |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`                | Fixed value: `/sign-up`                                                 |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | Fixed value: `/dashboard`                                               |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | Fixed value: `/dashboard`                                               |
| `CLERK_WEBHOOK_SIGNING_SECRET`                 | Clerk dashboard → Configure → Webhooks → your endpoint → Signing Secret |

## First-Time Setup

\`\`\`powershell
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
\`\`\`

## Known Gotchas (learned the hard way)

- Prisma 7 requires the datasource `url` to live in `prisma.config.ts`, NOT in `schema.prisma`'s datasource block.
- Prisma Client generates to `lib/generated/prisma/client` (custom output path), not the default `node_modules/@prisma/client` — import from `./generated/prisma/client` in `lib/prisma.ts`.
- Vercel env vars must be explicitly checked for **Production** — they don't apply there by default even if set.
- `NEXT_PUBLIC_*` variables are baked in at build time — changing one requires a fresh redeploy (uncheck "use existing build cache"), not just a settings save.
- shadcn components built on **Base UI** (not Radix) do not support the `asChild` prop — nest children directly instead, or use Base UI's `render` prop pattern.
- Clerk Core 3 replaced `<SignedIn>`/`<SignedOut>` with a single `<Show when="signed-in">` / `<Show when="signed-out">` component.
- Next.js 16 removed the `next lint` command entirely — use `"lint": "eslint ."` in package.json instead. The auto-generated `eslint.config.mjs` using `FlatCompat` will crash with "Converting circular structure to JSON" on `eslint-config-next`'s React hooks config — import `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` directly instead (native flat config, no FlatCompat needed).
