# Pathfinder

A small, browser-based guide for working through a problem one practical step at a time.

## Run locally

```bash
npm install
npm run start
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

## Publish with GitHub Pages

The included workflow builds and publishes the site whenever `main` is updated. It uses a relative Vite base path, so the generated assets work from a repository URL such as `https://<owner>.github.io/<repository>/` and from a custom domain.

1. Push this repository to GitHub and merge or push the changes to `main`.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for **Deploy site to GitHub Pages** to finish.
5. Open the URL shown on the completed deployment, or the URL displayed in **Settings → Pages**.

For a manual production build, run:

```bash
npm install
npm run build
```

The deployable files are created in `dist/`.
