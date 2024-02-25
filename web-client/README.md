# Astro Frontend

## Getting Started

1. Installing package manager for node

On Windows:

```bash
npm i -g pnpm
```

or on MaCOS or Linux

```bash
sudo npm i -g pnpm
```

2. Install node modules by running `pnpm i` when you are getting started or whenever you pull changes using `git pull`

3. Start the development server using `pnpm run dev`

4. In another teminal, run the CORS proxy to avoid getting errors with api calls

```bash
cd web-client
pnpm proxy
```

5. Use git lens vscode extension to add and commit files or you can also do it manually using git in yoru terminal

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── HeroHeader.tsx
│   │   └── Signin.tsx
│   │   └── Signup.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
│       └── signin.astro
│       └── signup.astro
│       └── dashboard.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [Astro documentation](https://docs.astro.build).
