#  Volunteer Platform - Backend Server

This is the core REST API server for the Volunteer Organization & Support Platform. It handles authentication, data management for events, and coordinates communication between the MongoDB database, Firebase services, and the AI recommendation engine.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** Firebase Admin SDK (Token Verification)
* **Integration:** Flask AI Module Connection
* **Security:** CORS, JWT (Firebase), Environment Variable Management

## Architecture & Structure

```text
server/
├── config/         # Database and Firebase configurations
├── controllers/    # Request handling logic
├── models/         # MongoDB Schemas (User, Event, Emergency, Transport)
├── routes/         # API Route definitions
├── middleware/     # Auth and Role-based access control
└── utils/          # Helper functions and AI service connectors

  Features & Endpoints
 Authentication (/api/users)
POST /register: Registers new users and syncs with Firebase UID.

POST /login: Validates user credentials.

GET /profile: Fetches authenticated user data.

 Emergency Support (/api/emergencies)
POST /: Reports a new emergency incident.

GET /: Fetches all active emergency calls for the map view.

 Event Management (/api/events)
GET /: Lists all approved volunteer activities.

POST /: Creates a new event (Organization/Admin only).

POST /:id/join: Allows volunteers to sign up for an event.

 AI Recommendations (/api/events/recommendations)
This endpoint acts as a proxy, sending user coordinates to the Python/Flask AI Module and returning optimized suggestions.

 Installation & Setup
1-Install dependencies:
npm install

2-Environment Configuration:
Create a .env file in the root directory:
PORT=3001
MONGO_URI=your_mongodb_connection_string
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
AI_MODULE_URL=[http://127.0.0.1:5002/recommend](http://127.0.0.1:5002/recommend)

3-Run the server:
# Development mode
npm run dev

# Production mode
npm start

Security Implementation
Middleware Protection: Private routes are protected by a middleware that verifies the Firebase ID Token sent in the Authorization header.

RBAC: Role-Based Access Control ensures that only users with the admin or organization role can create or verify events.

Data Validation: Mongoose schemas enforce strict data types and required fields for all database entries.

Backend Engine for the Volunteer Coordination Ecosystem.