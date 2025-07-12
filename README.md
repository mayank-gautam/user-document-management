# 📚 User Document Management – NestJS Backend

A robust, modular backend system built with **NestJS** supporting:

- 🔐 JWT Authentication & Role-based Authorization (Admin, Editor, Viewer)
- 📄 Document CRUD with ownership controls
- ⚙️ Ingestion Job Triggering and Tracking
- 🧪 70%+ Unit Test Coverage
- 🧱 PostgreSQL with TypeORM
- ✨ Modular & Scalable Architecture

---

## ⚙️ Setup Instructions (Local without Docker)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mayank-gautam/user-document-management.git
cd user-document-management
2️⃣ Install Dependencies
bash
npm install

3️⃣ Configure Environment
Create a .env file in the root directory.

bash
cp .env.example .env
Edit .env:

env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=udm_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600s
4️⃣ Setup PostgreSQL
Make sure PostgreSQL is installed and running. Create a database:

sql
CREATE DATABASE udm_db;
5️⃣ Start the Server
bash
npm run start:dev
API will be available at:
👉 http://localhost:3000

🚀 API Endpoints
🔐 Auth APIs
Method	Route	Description	Access
POST	/auth/register	Register new user	Public
POST	/auth/login	Login and get JWT	Public

👤 User Management (Admin Only)
Method	Route	Description
GET	/users	List all users
PATCH	/users/:id/role	Update user role

📄 Document APIs
Method	Route	Description	Access
POST	/documents	Upload new document	Authenticated
GET	/documents	List all documents	Viewer+
GET	/documents/:id	Get specific document	Viewer+
PATCH	/documents/:id	Update title	Owner Only
DELETE	/documents/:id	Delete document	Owner Only

⚙️ Ingestion APIs
Method	Route	Description
POST	/ingestion/trigger/:docId	Trigger ingestion job
GET	/ingestion	List all ingestion jobs
GET	/ingestion/:id	Get ingestion job by ID

🧪 Running Tests
Run all tests:

bash
npm run test
Check test coverage:

bash
npm run test:cov
✅ All modules are tested with Jest.
Aim for at least 70%+ code coverage.

📂 Folder Structure
bash
src/
├── auth/           # Register, login, JWT strategy
├── users/          # User entity, roles, service
├── documents/      # Document CRUD, access control
├── ingestion/      # Ingestion job trigger & tracking
├── common/         # Guards, interceptors, decorators
├── main.ts         # App bootstrap
└── app.module.ts   # Root module
📦 Packages Used
@nestjs/jwt – JWT authentication

@nestjs/typeorm – ORM integration

bcrypt – Password hashing

class-validator – DTO validation

jest – Unit testing

pg – PostgreSQL driver

✨ Features
 Modular architecture (separate modules/services)

 Role-based access using custom decorators

 Guards for authentication & authorization

 Fully unit tested modules

 DTO validation with class-validator

 JWT Authentication with expiration

📌 Optional Enhancements
Swagger API Docs via @nestjs/swagger

Seed script to generate 1000+ users & documents

Pagination and search in document listing

Rate limiting using @nestjs/throttler

Logging with winston or pino

Inter-service communication (Microservices)

📝 Final Submission Checklist
✅ Application runs locally without Docker

✅ Code is pushed to GitHub Repo

✅ .env.example provided

✅ At least 70% unit test coverage

✅ Modular structure with clean folder separation

✅ Routes covered: Auth, Users, Documents, Ingestion

✅ README includes setup and API docs

🔗 Submission Link
📤 Submit your repository:
https://github.com/mayank-gautam/user-document-management.git
🙋 Need Help?
If you want:

Seed script to generate test users & documents
npm run seed
