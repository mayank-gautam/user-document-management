# 📚 User Document Management – NestJS Backend

A scalable, production-ready backend system built with **NestJS**, featuring:

- 🔐 JWT Authentication & Role-based Authorization (`Admin`, `Editor`, `Viewer`)
- 📄 Document CRUD with ownership and access control
- ⚙️ Ingestion Job Triggering & Tracking
- 🧪 70%+ Unit Test Coverage using **Jest**
- 🧱 PostgreSQL with TypeORM
- ✨ Clean, Modular, and Extensible Architecture

---

## 🚀 Features

- ✅ Modular architecture with separation of concerns
- ✅ Role-based access control using custom decorators
- ✅ Guards for authentication and permissions
- ✅ DTO validation with `class-validator`
- ✅ JWT-based authentication with expiration
- ✅ Fully unit tested services & controllers
- ✅ PostgreSQL database integration with TypeORM

---

## ⚙️ Local Setup (Without Docker)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mayank-gautam/user-document-management.git
cd user-document-management

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables
Create a .env file:
cp .env.example .env
Edit .env as per your local setup:

PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=udm_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600s

4️⃣ PostgreSQL Setup
Ensure PostgreSQL is installed and running. Create the required database:
CREATE DATABASE udm_db;

5️⃣ Start the Server
npm run start:dev
API will be available at:
📍 http://localhost:3000

📂 Folder Structure
src/
├── auth/           # Login, Register, JWT Strategy
├── users/          # User entity, roles, services
├── documents/      # CRUD, ownership checks
├── ingestion/      # Ingestion jobs (trigger + status)
├── common/         # Guards, interceptors, decorators
├── main.ts         # App bootstrap
└── app.module.ts   # Root module


🔐 API Endpoints
| Method | Route          | Description         | Access |
| ------ | -------------- | ------------------- | ------ |
| POST   | /auth/register | Register new user   | Public |
| POST   | /auth/login    | Login and get token | Public |

👤 Users (Admin Only)
| Method | Route             | Description           |
| ------ | ----------------- | --------------------- |
| GET    | /users            | List all users        |
| PATCH  | /users/\:id/roles | Update user roles     |
| DELETE | /users/\:id       | Delete a user account |

📄 Documents
| Method | Route           | Description           | Access        |
| ------ | --------------- | --------------------- | ------------- |
| POST   | /documents      | Upload document       | Authenticated |
| GET    | /documents      | List documents        | Viewer+       |
| GET    | /documents/\:id | Get specific document | Viewer+       |
| PATCH  | /documents/\:id | Update document title | Owner only    |
| DELETE | /documents/\:id | Delete document       | Owner only    |

⚙️ Ingestion
| Method | Route                      | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | /ingestion/trigger/\:docId | Trigger ingestion job   |
| GET    | /ingestion/jobs            | List all ingestion jobs |
| GET    | /ingestion/jobs/\:id       | Get job by ID           |


🧪 Running Tests
npm run test


📦 Dependencies Used
@nestjs/common, @nestjs/core, @nestjs/typeorm, @nestjs/jwt

bcrypt, class-validator, pg

jest (unit testing)

passport, passport-jwt, typeorm

📘 Optional Enhancements
✅ Swagger API docs using @nestjs/swagger

✅ Rate limiting using @nestjs/throttler

⏳ Pagination & search in document listing

⏳ Logging via winston or pino

⏳ Database seeding script for users/documents

⏳ Inter-service communication with microservices

✅ Submission Checklist
 Application runs locally without Docker

 .env.example provided

 Clean, modular folder structure

 Auth, Users, Documents, Ingestion APIs covered

 Unit tests implemented

 Test coverage above 70%

 README includes setup & API documentation

 🔗 Submission
📤 GitHub Repo:
https://github.com/mayank-gautam/user-document-management

🙋 Need Help?
To seed sample data:
npm run seed
```
