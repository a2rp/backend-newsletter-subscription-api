# backend-newsletter-subscription-api

Secure newsletter subscription API built with Node.js, Express, MongoDB, JWT, and HttpOnly cookies.

## Features

- Public subscribe and unsubscribe endpoints
- Admin registration, login, and logout
- Admin-only active subscriber listing
- Hashed admin passwords with bcrypt
- Seven-day JWT authentication in an HttpOnly cookie
- Configurable CORS with credentials
- Helmet security headers and rate limiting
- Input validation, safe errors, request size limits, and API request logs
- MongoDB persistence through Mongoose

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a hosted MongoDB connection

## Setup

```bash
npm install
copy .env.example .env
```

Set a real MongoDB URI and a random `JWT_SECRET` with at least 32 characters in `.env`.

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
| `JWT_SECRET` | Yes | Random secret, minimum 32 characters |
| `NODE_ENV` | No | Use `production` to enable Secure cookies |
| `CLIENT_ORIGINS` | No | Comma-separated trusted frontend origins |
| `COOKIE_SAME_SITE` | No | Cookie policy, defaults to `lax` |

## API endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/` | Public | API status |
| GET | `/health` | Public | Health response |
| POST | `/api/auth/register` | Public | Register an admin and set cookie |
| POST | `/api/auth/login` | Public | Login and set cookie |
| POST | `/api/auth/logout` | Public | Clear auth cookie |
| POST | `/api/newsletter/subscribe` | Public | Subscribe an email |
| POST | `/api/newsletter/unsubscribe` | Public | Mark an email unsubscribed |
| GET | `/api/newsletter/subscribers` | Admin cookie | List active subscribers |

All JSON responses include `apiUrl` as the first field. Browser clients must use `credentials: "include"` for cookie-based requests.


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

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me A Coffee: [https://buymeacoffee.com/a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [https://patreon.com/a2rp](https://patreon.com/a2rp)