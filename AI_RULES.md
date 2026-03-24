# AI Rules

## Tech stack

- **Frontend framework:** React 18 with function components and hooks.
- **Build tool:** Vite 4 for local development and production builds.
- **Language:** JavaScript with JSX (`.js` / `.jsx`) — this app is **not** currently using TypeScript.
- **Styling:** Tailwind CSS 3, configured through `src/index.css`, `tailwind.config.js`, and PostCSS.
- **Icons:** `lucide-react` for all app icons.
- **Class helpers:** `clsx` and `tailwind-merge` for conditional and merged Tailwind class names when needed.
- **Persistence:** Browser `localStorage` for client-side state persistence, with helpers in `src/lib/storage.js`.
- **AI/server integration:** Server-side API handler in `api/gemini.js` for Gemini requests; secrets are read from environment variables.
- **Project structure:** UI code lives in `src/`, with reusable pieces in `src/components/` and screen-level content in `src/sections/`.
- **Current app architecture:** Single-page React app with section-based navigation managed in app state, not React Router.

## Library usage rules

### Core UI

- Use **React** for all UI, state, effects, and component composition.
- Prefer **small functional components** and React hooks over class components.
- Keep shared UI in `src/components/`.
- Keep larger feature/screen blocks in `src/sections/`.

### Styling

- Use **Tailwind CSS** for all styling.
- Do **not** add inline style objects unless there is no practical Tailwind equivalent.
- Reuse existing Tailwind patterns before introducing new design systems or CSS frameworks.
- If class strings become conditional or hard to manage, use **`clsx`** plus **`tailwind-merge`**.

### Icons and visuals

- Use **`lucide-react`** for icons.
- Do **not** introduce a second icon library unless there is a clear gap that Lucide cannot cover.

### Data and persistence

- Use **`localStorage`** for lightweight client persistence already handled in this app.
- Route all local storage reads/writes through the existing storage helpers when possible.
- Do **not** introduce a new global state library unless the existing React state approach becomes clearly insufficient.

### AI and external APIs

- Send AI requests through **server-side handlers** like `api/gemini.js`.
- Do **not** call Gemini directly from client components if that would expose API keys or secrets.
- Keep environment-based secrets on the server only.

### Firebase

- **Firebase is installed but not currently used in the app code.**
- Only use Firebase if the feature explicitly needs backend services such as auth, database, or hosting-related integrations.
- Do **not** add Firebase usage for data that already fits the current localStorage-based approach.

### Dependencies

- Prefer the libraries that are already in `package.json` before adding new ones.
- Do **not** add overlapping libraries for styling, icons, state management, or utility helpers without a strong reason.
- Keep the dependency footprint small and aligned with the current stack.

## Implementation rules

- Preserve the current **Vite + React + Tailwind** setup.
- Match the existing **JavaScript/JSX** code style unless the app is explicitly migrated to TypeScript.
- Keep secrets out of the client bundle.
- Favor simple, readable components over premature abstraction.
- When adding new functionality, follow the existing folder structure and naming patterns.
