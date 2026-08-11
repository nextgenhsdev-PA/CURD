# OneRxiv Care Network

A connected CRUD system: **Hospitals**, **Doctors**, **Nurses**, and **Patients**, all properly linked — a patient is assigned to a hospital, a doctor, and a nurse. Built with Express, Mongoose, and MongoDB Atlas, with a small built-in web UI for demoing it without a terminal.

## Project structure

```
onerxiv-care-network/
├── server.js              # entry point
├── db.js                  # MongoDB connection
├── seed.js                # loads sample hospitals/doctors/nurses/patients
├── models/
│   ├── Hospital.js
│   ├── Doctor.js
│   ├── Nurse.js
│   └── Patient.js
├── utils/
│   ├── crudFactory.js     # shared CRUD logic used by every entity
│   └── crudRouter.js      # shared route wiring used by every entity
├── routes/
│   ├── hospitalRoutes.js
│   ├── doctorRoutes.js
│   ├── nurseRoutes.js
│   └── patientRoutes.js
└── public/
    └── index.html          # tabbed demo UI (Hospitals / Doctors / Nurses / Patients)
```

## Why a "CRUD factory"

Every entity needs the same five operations (create, list, get one, update, delete). Instead of writing that logic four separate times, `utils/crudFactory.js` builds a controller for any Mongoose model in one call — each entity's route file just configures which fields are allowed and which references to populate. A fix to shared logic (pagination, error handling) applies everywhere at once, and adding a new entity later is a small addition, not a rewrite.

## Setup

1. Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/onerxiv_care_network
   PORT=4000
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Load sample data (2 hospitals, 3 doctors, 2 nurses, 5 patients, all linked):
   ```bash
   node seed.js
   ```
4. Run it:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:4000` — click through each tab (Hospitals, Doctors, Nurses, Patients), add a record, delete a record, confirm each works before assuming it's done.

## API endpoints

Every entity exposes the same five routes, e.g. for patients:

| Method | Path | Does |
|---|---|---|
| POST | `/api/patients` | Create |
| GET | `/api/patients` | List (paginated, `?page=&limit=`) |
| GET | `/api/patients/:id` | Get one |
| PATCH | `/api/patients/:id` | Update |
| DELETE | `/api/patients/:id` | Delete |

Same shape for `/api/hospitals`, `/api/doctors`, `/api/nurses`.

## Known limitation (not a bug, just not built yet)

Deleting a Hospital doesn't currently check whether Doctors, Nurses, or Patients still reference it — no cascade delete or block. Worth adding before this goes further than a demo.

## Deploying

Push to its own GitHub repo, then deploy on Render (or similar) as a Web Service:
- Build command: `npm install`
- Start command: `npm start`
- Add the `MONGO_URI` environment variable in the host's dashboard — your local `.env` never gets pushed to git, so this step is required separately on every host.
- Make sure MongoDB Atlas → Network Access allows connections from your host (0.0.0.0/0, or the host's specific IP range).
