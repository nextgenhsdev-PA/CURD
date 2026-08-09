# OneRxiv CRUD Tutorial

A tiny, heavily-commented Express + MongoDB API. One resource ("Patient"),
all four CRUD operations, done correctly. Read through the comments in
`server.js`, `db.js`, `models/Patient.js`, `controllers/patientController.js`,
and `routes/patientRoutes.js` — that's the actual lesson. This README just
gets it running.

## 1. Set up MongoDB Atlas (free, ~5 minutes)

1. Go to mongodb.com/atlas and create a free account.
2. Create a free "M0" cluster (any region close to you).
3. Under **Database Access**, create a database user with a username + password. Save these.
4. Under **Network Access**, click "Add IP Address" → "Allow access from anywhere" (fine for learning; tighten this later for production).
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
6. Replace `<username>` and `<password>` with the real values, and add a database name at the end, e.g. `.../onerxiv_tutorial?retryWrites=true...`

## 2. Configure the project

```bash
cp .env.example .env
```
Open `.env` and paste your real connection string into `MONGO_URI`.

## 3. Install and run

```bash
npm install
npm run dev
```

You should see:
```
MongoDB connected successfully
Server running on http://localhost:4000
```

If you see a connection error instead, it's almost always one of:
- Wrong password in the connection string
- Forgot to allow your IP in Atlas → Network Access
- Typo in the database name

## 4. Test every CRUD operation

Use Postman, Thunder Client, or plain `curl`. Examples below use `curl`.

**Create** a patient:
```bash
curl -X POST http://localhost:4000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria Chen","age":42,"condition":"Type 2 Diabetes","email":"maria@example.com"}'
```
Copy the `_id` from the response — you'll need it below.

**Read** all patients:
```bash
curl http://localhost:4000/api/patients
```

**Read** one patient (replace `PASTE_ID`):
```bash
curl http://localhost:4000/api/patients/PASTE_ID
```

**Update** a patient:
```bash
curl -X PATCH http://localhost:4000/api/patients/PASTE_ID \
  -H "Content-Type: application/json" \
  -d '{"condition":"Type 2 Diabetes, well controlled"}'
```

**Delete** a patient:
```bash
curl -X DELETE http://localhost:4000/api/patients/PASTE_ID
```

## 5. Things to try breaking on purpose (this is how you actually learn it)

- Try creating a patient without `email` — you should get a clean 400 error, not a crash.
- Try creating the same email twice — you should get a 409 "already exists" error.
- Try `GET /api/patients/123` (not a real MongoDB ID) — should be a clean 400, not a server crash.
- Try `GET /api/patients/64f000000000000000000000` (a fake but valid-looking ID) — should be a 404.
- Open MongoDB Compass, connect using the same connection string, and watch the `patients` collection change live as you run these requests.

## 6. Where to go from here

- Add a second resource (e.g. `Prescription`) that references a `Patient` by ID — this is where you learn about relationships between collections.
- Add authentication (JWT) so only logged-in users can hit these routes.
- Add request validation with a library like `zod` or `joi` instead of manual checks.
- Write a couple of tests with `jest` + `supertest`.
