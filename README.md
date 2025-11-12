# MyBin Backend (Sequelize + XAMPP MySQL)

Quick notes to connect this backend to a MySQL server provided by XAMPP.

1) Start XAMPP and enable MySQL (and Apache if you need PHP tools).

2) Copy `.env.example` to `.env` and set values. Typical XAMPP defaults:

   - DB_USER: root
   - DB_PASS: (empty)
   - DB_HOST: 127.0.0.1
   - DB_PORT: 3306

3) Install dependencies and run the server:

```powershell
npm install
npm run dev   # requires nodemon (already in devDependencies)
```

4) What the code does:

- `config/db.js` creates a Sequelize instance using env vars.
- `models/` defines `User` and `Bin` models and associations.
- `server.js` authenticates to DB, runs `sequelize.sync()` (creates tables if missing), then starts the Express server.

5) Next steps (optional):

- If you prefer migrations instead of `sync()`, add `sequelize-cli` and create migrations for `User` and `Bin`.
- Secure your credentials (do not commit `.env`).
