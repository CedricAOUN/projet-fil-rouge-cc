
### Getting started
`npm install` to get frontend dependencies

### Launch in dev environment

Ensure you are back at root of the project, and run these commands in 2 separate terminals:

- `npm run dev`


### Backend

Backend handled by https://github.com/CedricAOUN/pfr-backend-cc.

Follow instructions in the backend README to get it running. Afterwards, make a `.env` file and set VITE_API_URL to the backend URL (e.g. `http://localhost:8080`).


## Stripe
If running locally, run stripe cli with `stripe listen --forward-to localhost:8080/api/v1/stripe/webhook` to enable full stripe functionality.
