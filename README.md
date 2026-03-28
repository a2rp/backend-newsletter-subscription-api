# backend-newsletter-subscription-api

Backend API for newsletter subscribe, unsubscribe, and subscriber listing using Node.js, Express, MongoDB, JWT, and HttpOnly cookies.

## Features

- Subscribe to newsletter
- Unsubscribe from newsletter
- Admin register
- Admin login
- Admin logout
- List all subscribers (admin only)
- Protected admin routes
- JWT authentication
- HttpOnly cookie based auth
- MongoDB with Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser

## Environment Variables

Create a .env file:

```bash
PORT=1205
MONGO_URI=mongodb://127.0.0.1:27017/backend_newsletter_subscription_api
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Newsletter

- POST /api/newsletter/subscribe
- POST /api/newsletter/unsubscribe
- GET /api/newsletter/subscribers

### Subscriber Fields

- email
- subscribed

## Notes

- Anyone can subscribe or unsubscribe
- Only admin can list subscribers
- Authentication via HttpOnly cookies
- Use withCredentials: true in frontend
