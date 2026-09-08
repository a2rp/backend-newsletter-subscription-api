# Newsletter Subscription API Documentation

## Overview

This API stores newsletter subscriptions in MongoDB. Anyone can subscribe or unsubscribe an email address. Subscriber listing is protected by an admin JWT stored in an HttpOnly cookie.

## Authentication flow

1. Register an admin with a name, valid email, and password of at least eight characters.
2. The API hashes the password and sets a seven-day `token` cookie.
3. Login performs the same cookie-based authentication for an existing admin.
4. Send the cookie with `credentials: "include"` when requesting the protected subscriber list.
5. Logout clears the cookie using matching path and security options.

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/` | None | API status |
| GET | `/health` | None | Health response |
| POST | `/api/auth/register` | None | Create admin and authenticate |
| POST | `/api/auth/login` | None | Authenticate admin |
| POST | `/api/auth/logout` | None | Clear auth cookie |
| POST | `/api/newsletter/subscribe` | None | Create or reactivate subscription |
| POST | `/api/newsletter/unsubscribe` | None | Deactivate a subscription |
| GET | `/api/newsletter/subscribers` | Admin cookie | List active subscribers |

Successful and error JSON responses include `apiUrl` as the first field. Each request is logged as `[API] METHOD path -> status`.

## Security notes

- Passwords are hashed with bcrypt before storage.
- JWTs are kept in an HttpOnly cookie and never returned in JSON.
- Production cookies use `Secure` when `NODE_ENV=production`.
- CORS accepts only origins configured in `CLIENT_ORIGINS`.
- Helmet adds baseline security headers.
- Authentication and newsletter routes have request rate limits.
- Request bodies are limited to 10 KB.
- Internal database and token errors are not exposed to clients.
- `.env` is ignored and must never be committed.

## Local setup

```bash
npm install
copy .env.example .env
npm run dev
```

The default port is `1198`. Run `npm test` for in-process automated checks without starting the server.

## Frontend example

```js
await fetch("http://localhost:1198/api/newsletter/subscribers", {
    credentials: "include",
});
```

## License

MIT. See [LICENSE](./LICENSE).
