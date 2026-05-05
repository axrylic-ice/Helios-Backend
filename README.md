# Helios Backend

Helios is a quantitative finance decision tool built for the BWAI OAU Hackathon 2026. It helps individuals and businesses make data-driven foreign exchange decisions by combining real-time market signals, news sentiment analysis, prediction market data, and machine learning to return one clear recommendation: **ACT**, **WAIT**, or **HOLD**.

A user inputs an FX pair, an amount, and a time horizon. Helios fetches the latest signal from its ML engine, applies decision logic, and returns a comprehensive response including market state, signal sources, relevant news, and cross-market FX data.

---

## Live Production URLs

| Service | URL |
|---|---|
| Backend API | https://helios-backend-966417183733.us-central1.run.app |
| Frontend | https://fotunafx.web.app |
| ML Engine | https://helios-ml-engine-183763913483.europe-west1.run.app/fx/decision |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js (ES Modules) | Server runtime |
| Framework | Express.js v5 | HTTP server and routing |
| Database | PostgreSQL | Data persistence |
| Database Client | pg | PostgreSQL queries |
| Authentication | JWT + bcryptjs | User auth and password hashing |
| Validation | express-validator | Request validation |
| Scheduling | node-cron | Hourly ML signal sync |
| HTTP Client | axios | Calls ML engine |
| Deployment | Google Cloud Run | Serverless container hosting |
| Database Hosting | Google Cloud SQL | Managed PostgreSQL |

---

## Project Structure

```
Helios-Backend/
├── server.js                       # Entry point, starts server and cron jobs
├── src/
│   ├── app.js                      # Express app, middleware, route mounting
│   ├── config/
│   │   ├── db.js                   # PostgreSQL connection pool
│   │   └── jwt.js                  # Token generation and verification
│   ├── auth/
│   │   ├── auth.routes.js          # Auth endpoints
│   │   ├── auth.controller.js      # Auth request and response handling
│   │   └── auth.service.js         # Auth business logic
│   ├── api/
│   │   ├── signals.routes.js       # Signals endpoints
│   │   ├── signals.controller.js   # Signals request and response handling
│   │   ├── decisions.js            # Decisions endpoints
│   │   └── alerts.js               # Alerts endpoints
│   ├── services/
│   │   ├── signals.service.js          # Reads signals from database
│   │   ├── decisionService.js          # Coordinates the decision flow
│   │   ├── alertsService.js            # Creates and reads alerts
│   │   ├── decisionSnapshotBuilder.js  # Saves decisions to database
│   │   ├── mlSync.service.js           # Calls ML engine and saves signal
│   │   └── cron.js                     # Schedules hourly ML sync
│   ├── domain/
│   │   ├── decisionResolver.js     # Applies ACT, WAIT, HOLD rules
│   │   └── impactFormatter.js      # Shapes the final response
│   ├── middleware/
│   │   ├── AppError.js             # Custom error class
│   │   ├── protect.js              # JWT authentication guard
│   │   ├── validate.js             # Request validation rules
│   │   └── errorHandler.js         # Centralized error handler
│   └── models/
│       ├── migrate.js              # Creates all database tables
│       └── seed.sql                # Inserts test signal data
├── .env                            # Environment variables (not committed)
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

---

## How It Works

### Full Request Flow

```
User hits POST /decisions/analyze
            ↓
protect middleware
checks JWT token from Authorization header
if invalid → 401 Unauthorized
            ↓
validation middleware
checks fx_pair, amount, time_horizon_days are present and valid
if missing → 400 Bad Request
            ↓
Decision Controller
receives the validated request
            ↓
Decision Service
calls signals service to fetch latest signal for the FX pair
            ↓
Domain Layer (Decision Resolver)
reads the ML engine decision from raw_data
if no ML decision → falls back to rule based logic:
  risk > 0.7 → WAIT
  risk < 0.3 and confidence > 0.7 → ACT
  else → HOLD
            ↓
Domain Layer (Impact Formatter)
shapes the full response with market state, news, signal sources
            ↓
Snapshot Builder
saves the complete decision record to the decisions table
            ↓
Alerts Service
auto-generates an alert for the user based on the decision
            ↓
Response returned to user
```

### Hourly ML Signal Sync

Every hour, a cron job automatically:

1. Calls the ML engine at `https://helios-ml-engine-183763913483.europe-west1.run.app/fx/decision`
2. Maps the response to the signals table schema
3. Saves the full raw response as JSONB in the `raw_data` column
4. The new signal is immediately available for all decision requests

No manual intervention is needed. The backend always has a fresh signal.

---

## Database Schema

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  company_name TEXT,
  country TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### signals
```sql
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fx_pair TEXT NOT NULL,
  risk_score FLOAT NOT NULL,
  volatility_level TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  summary TEXT,
  raw_data JSONB,
  generated_at TIMESTAMP DEFAULT NOW()
);
```

### decisions
```sql
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fx_pair TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  time_horizon_days INT NOT NULL,
  signal_snapshot_id UUID REFERENCES signals(id),
  result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### fx_rates
```sql
CREATE TABLE fx_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_pair TEXT NOT NULL,
  rate DECIMAL NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### alerts
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Running Locally

### Prerequisites

- Node.js v18 or higher
- PostgreSQL installed and running locally

### Step 1: Clone the repository

```bash
git clone https://github.com/axrylic-ice/Helios-Backend.git
cd Helios-Backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create your environment file

Create a `.env` file in the root of the project and add the following:

```
PORT=3000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/helios
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

Replace `yourpassword` with your local PostgreSQL password.

### Step 4: Create the database

```bash
psql -U postgres -c "CREATE DATABASE helios;"
```

### Step 5: Run migrations

```bash
npm run migrate
```

This creates all five tables in your local database.

### Step 6: Seed test data (optional)

```bash
npm run seed
```

This inserts a test signal into the signals table so you can immediately test the decisions endpoint without waiting for the cron job to run.

### Step 7: Start the development server

```bash
npm run dev
```

The server starts on `http://localhost:3000` by default. The cron job also starts automatically and will fetch a real signal from the ML engine on the next hour.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `3000` |
| `DATABASE_URL` | Full PostgreSQL connection string | `postgresql://postgres:pass@localhost:5432/helios` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | How long tokens stay valid | `7d` |

The `.env` file is never committed to the repository. Team members receive credentials directly through a private channel.

---

## API Reference

### Base URL

**Production:**
```
https://helios-backend-966417183733.us-central1.run.app
```

**Local development:**
```
http://localhost:3000
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

Obtain a token from `POST /auth/signup` or `POST /auth/login`.

---

### Auth Endpoints

#### POST /auth/signup

Creates a new user account and returns a JWT token.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "company_name": "Acme Corp",
  "country": "Nigeria"
}
```

Validation rules:
- `email` is required and must be a valid email format
- `password` is required and must be at least 8 characters long
- `company_name` and `country` are optional

Success response (201):
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "e33ee33a-0ca1-4ce3-8f84-e71bc2a11e0f",
      "email": "user@example.com",
      "company_name": "Acme Corp",
      "country": "Nigeria",
      "created_at": "2026-04-28T10:03:52.914Z"
    }
  }
}
```

Error responses:
- `400` Email is required
- `400` Please provide a valid email
- `400` Password is required
- `400` Password must be at least 8 characters
- `409` Email already in use

---

#### POST /auth/login

Logs in an existing user and returns a JWT token.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Success response (200):
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "e33ee33a-0ca1-4ce3-8f84-e71bc2a11e0f",
      "email": "user@example.com",
      "company_name": "Acme Corp",
      "country": "Nigeria",
      "created_at": "2026-04-28T10:03:52.914Z"
    }
  }
}
```

Error responses:
- `400` Email is required
- `400` Password is required
- `401` Invalid email or password

---

#### GET /auth/me

Returns the profile of the currently logged in user. Protected.

Headers:
```
Authorization: Bearer your_token_here
```

Success response (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "e33ee33a-0ca1-4ce3-8f84-e71bc2a11e0f",
      "email": "user@example.com",
      "company_name": "Acme Corp",
      "country": "Nigeria",
      "created_at": "2026-04-28T10:03:52.914Z"
    }
  }
}
```

Error responses:
- `401` You are not logged in. Please log in to get access
- `401` Invalid or expired token. Please log in again
- `404` User not found

---

### Signals Endpoints

#### GET /signals/latest?fx_pair=NGN/USD

Returns the most recent ML signal for a given FX pair. Protected.

Headers:
```
Authorization: Bearer your_token_here
```

Query parameters:
- `fx_pair` (required): The currency pair e.g. NGN/USD

Success response (200):
```json
{
  "status": "success",
  "data": {
    "signal": {
      "id": "1466509f-3dab-4fe0-b81d-33a34555bb7e",
      "fx_pair": "NGN/USD",
      "risk_score": 0.05,
      "volatility_level": "LOW",
      "confidence": 0.95,
      "summary": "WAIT signal detected. Volatility: LOW, USD Flow: NEUTRAL",
      "raw_data": { ... },
      "generated_at": "2026-05-02T16:22:03.211Z"
    }
  }
}
```

Error responses:
- `400` FX pair is required
- `401` You are not logged in. Please log in to get access
- `404` No signal found for FX pair: NGN/USD

---

### Decision Endpoints

#### POST /decisions/analyze

Core endpoint. Analyzes an FX decision request and returns a data-driven recommendation. Protected.

Headers:
```
Authorization: Bearer your_token_here
```

Request body:
```json
{
  "fx_pair": "NGN/USD",
  "amount": 10000,
  "time_horizon_days": 5
}
```

Validation rules:
- `fx_pair` is required
- `amount` is required and must be greater than zero
- `time_horizon_days` is required and must be greater than zero

Success response (200):
```json
{
  "decisionId": "fd716792-8a8b-487f-9887-f7185a825fbb",
  "decision": "WAIT",
  "confidence": 0.95,
  "engine_health": "GOOD",
  "fx_pair": "NGN/USD",
  "summary": "WAIT signal detected. Volatility: LOW, USD Flow: NEUTRAL",
  "market_state": {
    "estimated_devaluation": 0.406,
    "volatility_level": "LOW",
    "liquidity_level": "HIGH",
    "usd_flow": "NEUTRAL"
  },
  "model_outputs": {
    "polymarket_sentiment": 0.30
  },
  "signal_sources": {
    "parallel": 1405,
    "official": 1375.98,
    "spread": 29.01
  },
  "news": [
    {
      "headline": "Global Inflation Outlook Worsens Amid Energy Shock",
      "summary": "The global economy faces headwinds as energy prices surge...",
      "source": "Reuters",
      "url": "https://reuters.com/article/...",
      "impact": "HIGH"
    }
  ],
  "fx_other_pairs": {
    "EURNGN": 1613.39,
    "GBPNGN": 1868.30,
    "AUDNGN": 990.70
  }
}
```

Decision values:
- `ACT` Low risk, high confidence. Conditions are favorable to convert now.
- `WAIT` High risk detected. Conditions are unfavorable. Wait before converting.
- `HOLD` Neutral conditions. Monitor the market before making a decision.

Error responses:
- `400` fx_pair, amount, and time_horizon_days are required
- `401` You are not logged in. Please log in to get access
- `404` No signal found for FX pair: NGN/USD

---

#### GET /decisions/:id

Fetch a single decision by its ID. Protected.

Headers:
```
Authorization: Bearer your_token_here
```

Success response (200): Returns the full decision record from the database.

Error responses:
- `401` You are not logged in. Please log in to get access
- `404` Decision not found

---

#### GET /decisions/user/:userId

Fetch all decisions made by a specific user ordered by most recent first. Protected.

Headers:
```
Authorization: Bearer your_token_here
```

Success response (200): Returns an array of decision records.

---

### Alert Endpoints

#### GET /alerts

Returns all alerts for the logged in user. An alert is automatically created every time a user makes a decision request. Protected.

Headers:
```
Authorization: Bearer your_token_here
```

Success response (200):
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "message": "High risk detected for NGN/USD. Consider waiting before transacting.",
    "severity": "high",
    "is_read": false,
    "created_at": "2026-05-02T16:22:03.211Z"
  }
]
```

---

#### POST /alerts/read

Marks a specific alert as read. Protected.

Headers:
```
Authorization: Bearer your_token_here
```

Request body:
```json
{
  "alert_id": "uuid-of-the-alert"
}
```

Success response (200): Returns the updated alert with `is_read: true`.

Error responses:
- `400` alert_id is required
- `401` You are not logged in. Please log in to get access
- `404` Alert not found

---

## Error Response Format

All errors across the entire API follow this consistent format:

```json
{
  "status": "error",
  "message": "A clear description of what went wrong"
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad Request: missing or invalid input fields |
| 401 | Unauthorized: missing, invalid, or expired token |
| 404 | Not Found: resource does not exist |
| 409 | Conflict: for example a duplicate email on signup |
| 500 | Internal Server Error: unexpected server error |

---

## Deployment

The backend is containerized using Docker and deployed on Google Cloud Run. It connects to a managed PostgreSQL instance on Google Cloud SQL.

### Redeploy after changes

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project bwai-hackathon-492811

# Deploy
gcloud run deploy helios-backend --source . --region us-central1 --allow-unauthenticated
```

### Cloud SQL connection

The backend connects to Cloud SQL using the Cloud SQL socket proxy built into Cloud Run. The connection string uses the format:

```
postgresql://postgres:password@localhost/helios?host=/cloudsql/bwai-hackathon-492811:us-central1:helios-db
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Start | `npm start` | Start the production server |
| Dev | `npm run dev` | Start with nodemon for development |
| Migrate | `npm run migrate` | Create all database tables |
| Seed | `npm run seed` | Insert test signal data |

---

## Team

Built for the BWAI OAU Hackathon 2026 by Team Helios, Obafemi Awolowo University.

| Role | Responsibility |
|---|---|
| Backend | Server architecture, database design, auth, decision engine, API, deployment |
| Frontend | User interface, API integration |
| Data Science | ML model, signal generation, Bayse API integration, market data pipeline |