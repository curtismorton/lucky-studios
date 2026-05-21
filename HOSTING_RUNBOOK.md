# Lucky Studios Hosting Runbook (Vercel)

This is the exact deploy workflow to avoid broken assets and misconfigured production deploys.

## 1) One-time setup

1. Copy env template:
   ```bash
   cp .env.example .env.local
   ```
2. Fill required values in `.env.local`:
   - `NEXT_PUBLIC_SITE_URL`
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `CONTACT_FORM_ENDPOINT`
   - `NEXT_PUBLIC_CALENDLY_URL`
3. Add the same env vars in Vercel Project Settings > Environment Variables.

## 2) Asset rules

1. Put all site images under `public/images`.
2. Do not use spaces or mixed-case filenames for new assets.
3. If you reference `"/images/..."` in code, the file must exist at `public/images/...`.
4. Hero images expected by the current code are in `public/images/hero`.

## 3) Preflight before every deploy

Run:

```bash
npm run check:launch
```

This validates:
- `.env.local` presence and key env vars
- all `"/images/..."` paths used in `app`/`components`
- core logo assets

If this fails, do not deploy yet.

## 4) Build locally

```bash
npm run lint
npm run build
```

Note: `next/font/google` requires outbound network access during build.

## 5) Deploy (claimable preview flow)

Use the deploy script from the installed skill:

```bash
bash /Users/Curtis/.codex/skills/vercel-deploy/scripts/deploy.sh /Users/Curtis/DEV
```

If payload is too large, create a clean tarball excluding build artifacts and deploy that:

```bash
tar -czf /tmp/lucky-studios-deploy.tgz \
  -C /Users/Curtis/DEV \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='.env' \
  --exclude='.env.*' \
  --exclude='.codex' \
  --exclude='.cursor' \
  .

bash /Users/Curtis/.codex/skills/vercel-deploy/scripts/deploy.sh /tmp/lucky-studios-deploy.tgz
```

## 6) Post-deploy checks

1. Open homepage and verify hero images render.
2. Check `/shows` and one `/shows/<slug>` page.
3. Check `/contact` form submit flow.
4. Check `/sitemap.xml` and `/robots.txt`.
5. Share preview URL for sign-off, then claim deployment.

## 6.1) Domain cutover gate

As of April 9, 2026:
- `https://lucky-studios.vercel.app` serves the Lucky Studios Next.js app.
- `https://luckystudios.com` still serves a placeholder "Coming Soon" page.
- The deployed app currently emits canonical, Open Graph, sitemap, and robots URLs that point at `https://luckystudios.com`.

Do not treat production as complete until the custom domain serves the same app as the Vercel deployment.

Minimum verification:
1. `curl -I https://luckystudios.com` should return the app origin, not the placeholder host.
2. `https://luckystudios.com/sitemap.xml` should return the generated Lucky Studios sitemap.
3. `https://luckystudios.com/robots.txt` should return the generated Lucky Studios robots file.
4. One public page like `/about` and one show page like `/shows/back-post` should render from the custom domain.

If the custom domain is not cut over yet:
1. Keep sign-off and QA on the Vercel deployment URL only.
2. Fix DNS/domain mapping in Vercel before announcing the site publicly.
3. Re-run the post-deploy checks above on the custom domain after cutover.

## 7) Failure triage order

1. Run `npm run check:launch`
2. Run `npm run build`
3. Confirm Vercel env vars are set
4. Re-deploy with clean tarball excluding `.next`
