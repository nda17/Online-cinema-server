# «Online-cinema-server»

# Functional:

- Processing requests and sending responses to the client side
- Posting content 
- Interaction with MongoDB database
- Working with Access / Refresh JWT tokens
- Generating and sending letters to the user’s email

---

## Used stack:
- Typescript
- Nest-js
- JWT
- Passport-JWT
- MongoDb
- Typegoose
- UUID
- Bcryptjs
- Class-validator
- Generate-password
- Rxjs
- Reflect-metadata
- Fs-extra

---

## Adding personal settings to the .env environment variable:
- PORT = 4200

DEVELOPMENT mode or PRODUCTION mode (select one mode):
- NODE_ENV = production
- NODE_ENV = development

Host address in DEVELOPMENT mode or PRODUCTION mode:
- DEV_HOST = 'http://localhost:3100'
</br>
- PRODUCTION_HOST = 'http://localhost:3100 /-or-/ https://YOUR-DOMAIN.COM'
</br>

Path to database MongoDB:
- MONGO_URI = mongodb+srv://YOUR-DATABASE-PATH

- JWT_SECRET = 213^dsakjoi102 (any combination of letters and symbols)

Nodemailer:
- SMTP_HOST = 'YOUR SETTINGS'
- SMTP_PORT = 'YOUR SETTINGS'
- SMTP_USER = 'YOUR SETTINGS'
- SMTP_PASSWORD = 'YOUR SETTINGS'

---

## Compiles and minifies for production:
- yarn build
- npm run build
- pnpm build

---

## Getting started online development server:
- yarn dev
- npm run dev
- pnpm dev

---
