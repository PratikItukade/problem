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

The HTML, JavaScript, and stylesheet references are also relative. This means the app works if you choose either GitHub Pages publishing method: **GitHub Actions** or **Deploy from a branch** with the folder set to `/ (root)`.

1. Push this repository to GitHub and merge or push the changes to `main`.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for **Deploy site to GitHub Pages** to finish.
5. Open the URL shown on the completed deployment, or the URL displayed in **Settings → Pages**.

### Publishing directly from a branch

If you prefer not to use Actions, select **Deploy from a branch** in **Settings → Pages**, choose your publishing branch, and set the folder to **/ (root)**. Do not select `/docs`; the app files live at the repository root.

For a manual production build, run:

```bash
npm install
npm run build
```

The deployable files are created in `dist/`.
