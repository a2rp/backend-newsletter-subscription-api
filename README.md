# backend-newsletter-subscription-api

Secure newsletter subscription API built with Node.js, Express, MongoDB, JWT, and HttpOnly cookies.

## Features

- Public subscribe and signed unsubscribe endpoints
- One-time admin registration, login, and logout
- Admin-only active subscriber listing
- Hashed admin passwords with bcrypt
- Seven-day JWT authentication in an HttpOnly cookie
- Configurable CORS with credentials
- Helmet security headers and rate limiting
- Input validation, safe errors, request size limits, and API request logs
- MongoDB persistence through Mongoose

## Requirements

- Node.js 20.19 or newer
- MongoDB running locally or a hosted MongoDB connection

## Setup

```bash
npm install
copy .env.example .env
```

Set a real MongoDB URI and replace each example secret with a different random value of at least 32 characters. `MONGO_URI`, `JWT_SECRET`, and `ADMIN_REGISTRATION_SECRET` are required in every environment. Production also requires `UNSUBSCRIBE_SECRET` and `CLIENT_ORIGINS`. The first admin registration requires the `x-admin-registration-secret` header; registration closes after that account is created.

## Run

```bash
npm run dev
```

The default port is `1198`.

## Test

Tests run in-process and do not start a server:

```bash
npm test
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Server port, defaults to `1198` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Unique random JWT signing secret, minimum 32 characters |
| `ADMIN_REGISTRATION_SECRET` | Yes | Separate secret required to create the initial admin |
| `UNSUBSCRIBE_SECRET` | Production | Separate secret used by the trusted mail sender to sign unsubscribe links |
| `NODE_ENV` | No | Use `production` to enable Secure cookies |
| `CLIENT_ORIGINS` | No | Comma-separated trusted frontend origins |
| `COOKIE_SAME_SITE` | No | Cookie policy, defaults to `lax` |

## API endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/` | Public | API status |
| GET | `/health` | Public | Health response |
| POST | `/api/auth/register` | Setup secret | Create the initial admin and set cookie |
| POST | `/api/auth/login` | Public | Login and set cookie |
| POST | `/api/auth/logout` | Public | Clear auth cookie |
| POST | `/api/newsletter/subscribe` | Public | Subscribe an email |
| POST | `/api/newsletter/unsubscribe` | Signed token | Unsubscribe the address associated with the token |
| GET | `/api/newsletter/subscribers` | Admin cookie | List active subscribers |

All JSON responses include `apiUrl` as the first field. Browser clients must use `credentials: "include"` for cookie-based requests.

Admin passwords must contain at least 8 characters and no more than 72 UTF-8 bytes. They are hashed with bcrypt. Auth and newsletter routes use per-process in-memory rate limits; use a shared limiter store when deploying multiple server instances.

The unsubscribe token is an HMAC-SHA256 hex digest of the normalized email, signed with `UNSUBSCRIBE_SECRET`. Generate it only in a trusted server-side mail sender, never in browser code:

```js
const { createHmac } = require("node:crypto");

const token = createHmac("sha256", process.env.UNSUBSCRIBE_SECRET)
  .update(email.trim().toLowerCase())
  .digest("hex");
```

The API does not send subscription emails or perform double opt-in; it marks addresses active immediately. Public subscribe responses contain no subscriber details. Integrate a confirmation flow before sending campaigns. A mail sender must include the signed token in its unsubscribe link. Keep `UNSUBSCRIBE_SECRET` stable while mailed links need to work, since rotation invalidates old links. The unsubscribe endpoint returns the same success response whether or not the address exists, avoiding subscriber enumeration.


## License

MIT. See [LICENSE](./LICENSE).

## Author

Ashish Ranjan, Full-Stack Web Developer

- Website: https://ashishranjan.in/
- GitHub: https://github.com/a2rp
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Email: mailto:ash.ranjan09@gmail.com

## Support

- Support page: https://a2rp-donation-page.netlify.app/
- Buy Me a Coffee: https://buymeacoffee.com/a2rp
- Patreon: https://www.patreon.com/a2rp
