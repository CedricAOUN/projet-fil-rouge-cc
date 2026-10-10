
### Getting started
`npm install` to get frontend dependencies

### Customize the appearance

Edit `themeColors.light` and `themeColors.dark` at the top of
`src/theme/muiTheme.ts` to change the site's colors. `primary` controls main
actions, `secondary` controls supporting accents, and `premium` controls Premium
badges. `background`, `surface`, `text`, and `muted` control page and content
surfaces. Keep the corresponding `onPrimary`, `onSecondary`, and `onPremium`
foreground colors readable when changing an accent. Typography, spacing, corners,
and shared MUI component styles are defined in the same file.

Pages use MUI palette values rather than their own brand colors. Padded content
uses `ContentPanel`; image cards and menus manage their own spacing. The theme
switch preserves the existing saved light/dark preference. The homepage uses the
first free recipe photograph and displays a kitchen note if none can load.

Run `npm test -- --runInBand` after changing the palette: the editorial theme tests
check text/action contrast, keyboard theme switching, and homepage image fallback.

### Launch in dev environment

Ensure you are back at root of the project, and run these commands in 2 separate terminals:

- `npm run dev`


### Backend

Backend handled by https://github.com/CedricAOUN/pfr-backend-cc.

Follow instructions in the backend README to get it running. Afterwards, make a `.env` file and set VITE_API_URL to the backend URL (e.g. `http://localhost:8080`).


## Stripe
If running locally, run stripe cli with `stripe listen --forward-to localhost:8080/api/v1/stripe/webhook` to enable full stripe functionality.

## Tests and coverage

Use Node 22 or newer, then install the locked dependencies with `npm ci`.

```sh
npm test
npm run test:coverage
npm run typecheck
npm run build
```

Jest uses jsdom, React Testing Library and MSW. Tests in `tests/` use a fresh
Redux store, real RTK Query endpoints and intercepted HTTP responses; no running
backend or Google/Stripe/Groq account is needed. Unexpected requests fail tests.
Only third-party SDK/editor/player boundaries and missing browser APIs are faked.

The coverage command fails below **50% global executable-line coverage** across
every runtime TypeScript/JavaScript file in `src/`, including files no test imports.
Declarations are excluded; application components, pages and startup code remain
included. The working target is 60% or more. Other coverage metrics are informational.

Open `coverage/index.html` for the HTML report. `coverage/lcov.info` and
`coverage/coverage-summary.json` are available for CI/reporting. Reports and
portable local tooling in `.tools/` are ignored by Git.
