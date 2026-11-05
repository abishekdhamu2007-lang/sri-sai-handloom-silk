# Sri Sai Handloom Silk

React (Vite) storefront with customer sign-in, a saree collection, and an Express/MongoDB API.

## Run
```bash
# API
cd server
npm i
npm run seed
npm run dev
# Site (new terminal)
cd client
npm i
npm run dev
```
Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`.
Before starting the API, set `SESSION_SECRET` in `server/.env` to a random secret of at least 32 bytes. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Site: http://localhost:5173 · API: http://localhost:5000/api/products
The site shows built-in sample sarees if the products API is offline. Visitors can sign in or create an account, or browse as a guest. Passwords are hashed and sign-in uses secure, HTTP-only MongoDB-backed sessions.
Set `VITE_WHATSAPP` in `client/.env` to your number (country code, no +) — currently configured for `916381530958` (+91 63815 30958). Includes 1-click WhatsApp checkout, individual saree direct WhatsApp ordering, WhatsApp video call booking, search/price filtering, and a floating WhatsApp assistant.
