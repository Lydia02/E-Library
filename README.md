# E-library

*"Empowering African learners through accessible digital education"*

A digital library platform that provides students and readers with easy access to educational materials anytime, anywhere.

[![Security Scan](https://img.shields.io/badge/security-scanned-success)](https://github.com/Lydia02/summative-a-react-discovery-app-Lydia02/actions)

> A complete DevOps pipeline implementing Git-to-Production workflow with Infrastructure as Code, automated security scanning, and continuous deployment.

---

## African Context

Access to educational materials in many parts of Africa remains limited due to high costs, poor distribution, and lack of modern infrastructure. The e-Library project bridges this gap by offering a centralized digital platform where learners, teachers, and researchers can access, share, and manage books and academic resources online.
By promoting open access and resource sharing, the e-Library supports digital learning and literacy growth across African schools and communities.

## Team Members

- *Lydia Subuola Ojoawo* - Full Stack Developer & Project Lead 
- *Nadia Teta* - Frontend Developer & UI/UX Designer
- *Ann Dumo Peter Lau* - Backend Developer & Database Administrator

## Links

- [Live frontend](http://52.176.217.99:3000)
- [Live Backend](http://52.176.217.99:5000)
- [Project Board](https://github.com/Lydia02/E-Library/projects)
- [Repository](https://github.com/Lydia02/E-Library)
- [Issues](https://github.com/Lydia02/E-Library/issues)
- [Azure Portal](https://portal.azure.com)
- [Project Demo Video]()

## Project Overview

The e-Library is a web-based application that allows users to browse, search, and read digital books and learning materials. It simplifies how students and educators access educational content by storing resources in one place.
Users can explore available books, view details (author, category, publication date), and read them. The system aims to enhance knowledge accessibility while supporting digital transformation in African education systems.

### Target Users
- Students in schools and universities
- Teachers and academic researchers
- Community learners seeking self-education

### Core Features
- Book Catalog: Browse and search for books by title, author, or category.
- Add book: Admins and signed in users can add or manage e-books and documents.
- User Authentication: Register, log in, and manage user access.

### Project Tagline/Slogan
*“A Library in Your Pocket”*

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Bootstrap 5
- **Backend**: Node.js 20+, Express 5.1.0, ES6 Modules
- **Database**:
  - **Primary**: Firebase Firestore (NoSQL) - Real-time data sync
  - **Secondary**: Azure PostgreSQL (v15.14) - Backup & analytics
- **Authentication**: Firebase Authentication (JWT-based)
- **Image Storage**:
  - Open Library API (book covers by ISBN)
  - Google Books API (book metadata & thumbnails)
  - Firebase Storage (user-uploaded images)
- **Styling**: CSS3, Bootstrap 5, Responsive Design
- **Version Control**: Git, GitHub
- **DevOps**: GitHub Actions, Docker, Terraform, Ansible

---

##  Architecture Overview

![E-Library Architecture](./e-library-architecture.svg)

### Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USERS / CLIENTS                            │
│                         (Web Browsers)                               │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AZURE CLOUD INFRASTRUCTURE                        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Network Security Group (NSG)                               │    │
│  │  Allowed Ports: 22 (SSH), 3000 (Frontend), 5000 (Backend)  │    │
│  └──────────────────────────┬─────────────────────────────────┘    │
│                             │                                        │
│                             ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Azure VM (Bastion Host) - 52.176.217.99              │  │
│  │         Ubuntu 22.04 LTS | 2 vCPUs | 8GB RAM                 │  │
│  │                                                               │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │           Docker Compose Environment                    │ │  │
│  │  │                                                          │ │  │
│  │  │  ┌──────────────────────────────────────────────────┐  │ │  │
│  │  │  │  Frontend Container (Port 3000)                   │  │ │  │
│  │  │  │  ┌─────────────────────────────────────────────┐ │  │ │  │
│  │  │  │  │ React 18 + TypeScript                       │ │  │ │  │
│  │  │  │  │ ├─ Components (BookCard, BookCover)         │ │  │ │  │
│  │  │  │  │ ├─ Pages (Browse, Library, Dashboard)       │ │  │ │  │
│  │  │  │  │ ├─ Services (API clients, Auth)             │ │  │ │  │
│  │  │  │  │ └─ Smart Image Loading:                     │ │  │ │  │
│  │  │  │  │    1. Firebase coverImage URL               │ │  │ │  │
│  │  │  │  │    2. Open Library API (ISBN)               │ │  │ │  │
│  │  │  │  │    3. Google Books API (title/author)       │ │  │ │  │
│  │  │  │  │    4. SVG Fallback (generated)              │ │  │ │  │
│  │  │  │  └─────────────────────────────────────────────┘ │  │ │  │
│  │  │  │  Built with: Vite, Bootstrap 5                  │  │ │  │
│  │  │  └──────────────────┬───────────────────────────────┘  │ │  │
│  │  │                     │ REST API                          │ │  │
│  │  │                     ▼                                   │ │  │
│  │  │  ┌──────────────────────────────────────────────────┐  │ │  │
│  │  │  │  Backend Container (Port 5000)                    │  │ │  │
│  │  │  │  ┌─────────────────────────────────────────────┐ │  │ │  │
│  │  │  │  │ Node.js 20 + Express 5                      │ │  │ │  │
│  │  │  │  │ ├─ Controllers (Book, User, Favorites)      │ │  │ │  │
│  │  │  │  │ ├─ Services (Business Logic)                │ │  │ │  │
│  │  │  │  │ │  ├─ bookService.js                        │ │  │ │  │
│  │  │  │  │ │  ├─ userBookService.js                    │ │  │ │  │
│  │  │  │  │ │  ├─ favoriteService.js                    │ │  │ │  │
│  │  │  │  │ │  └─ authService.js                        │ │  │ │  │
│  │  │  │  │ ├─ Middleware (Auth, Error Handling)        │ │  │ │  │
│  │  │  │  │ └─ Dual-Database Architecture:              │ │  │ │  │
│  │  │  │  │    • Firebase (Primary) - Real-time         │ │  │ │  │
│  │  │  │  │    • PostgreSQL (Secondary) - Analytics     │ │  │ │  │
│  │  │  │  └─────────────────────────────────────────────┘ │  │ │  │
│  │  │  └──────────────────┬───────────────────────────────┘  │ │  │
│  │  └─────────────────────┼──────────────────────────────────┘ │  │
│  └────────────────────────┼────────────────────────────────────┘  │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            │
                ┌───────────┴────────────┐
                │                        │
                ▼                        ▼
┌───────────────────────────┐  ┌──────────────────────────┐
│   FIREBASE SERVICES       │  │  AZURE POSTGRESQL        │
│   (Google Cloud)          │  │  (Secondary DB)          │
│                           │  │                          │
│  ┌─────────────────────┐ │  │  ┌────────────────────┐ │
│  │ Firestore Database  │ │  │  │  PostgreSQL v15.14 │ │
│  │ (PRIMARY)           │ │  │  │  • users           │ │
│  │ Collections:        │ │  │  │  • books           │ │
│  │ • users             │ │  │  │  • favorites       │ │
│  │ • books             │ │  │  │  • user_books      │ │
│  │ • favorites         │ │  │  │  • reviews         │ │
│  │ • user_books        │ │  │  └────────────────────┘ │
│  │ • reviews           │ │  │                          │
│  │                     │ │  │  Background Sync:        │
│  │ Indexes Required:   │ │  │  • Non-blocking writes   │
│  │ ✓ favorites         │ │  │  • Analytics queries     │
│  │   (userId + date)   │ │  │  • Backup storage        │
│  │ ✓ user_books        │ │  └──────────────────────────┘
│  │   (userId + status) │ │
│  └─────────────────────┘ │
│                           │
│  ┌─────────────────────┐ │
│  │ Authentication      │ │
│  │ • Email/Password    │ │
│  │ • JWT Tokens        │ │
│  │ • User Management   │ │
│  └─────────────────────┘ │
│                           │
│  ┌─────────────────────┐ │
│  │ Storage (Optional)  │ │
│  │ • User uploads      │ │
│  │ • Book covers       │ │
│  │ • Documents         │ │
│  └─────────────────────┘ │
└───────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL IMAGE APIS                             │
│                                                              │
│  ┌────────────────────┐  ┌────────────────────────────────┐│
│  │ Open Library API   │  │  Google Books API              ││
│  │ • Book covers      │  │  • Book metadata               ││
│  │ • ISBN lookup      │  │  • Cover thumbnails            ││
│  │ • Title search     │  │  • Author info                 ││
│  │ • Free, no auth    │  │  • Free, no API key for images ││
│  └────────────────────┘  └────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Infrastructure Components

| Component | Technology | Details |
|-----------|-----------|---------|
| **Cloud Provider** | Microsoft Azure | East US region |
| **IaC Tool** | Terraform | Infrastructure as Code |
| **Container Registry** | Azure ACR | Private Docker images |
| **Compute** | Azure VM | Ubuntu 22.04 (2 vCPUs, 8GB RAM) |
| **Primary Database** | Firebase Firestore | NoSQL, real-time sync |
| **Secondary Database** | Azure PostgreSQL | v15.14, managed service |
| **Authentication** | Firebase Auth | JWT-based, Admin SDK |
| **Image Sources** | Open Library + Google Books | External APIs |
| **Storage** | Firebase Storage | User uploads (optional) |
| **Configuration** | Ansible | Automated deployment |
| **CI/CD** | GitHub Actions | Automated pipelines |
| **Containerization** | Docker + Compose | Multi-container orchestration |

---

##  Architecture Details

### Data Flow

#### 1. User Authentication Flow
```
User → Frontend → Firebase Auth → JWT Token → Backend → Firestore
                                                       → PostgreSQL (sync)
```

#### 2. Book Browse Flow
```
User → Frontend → Backend API → Firestore (primary)
                              → PostgreSQL (fallback)
     ← Book Data ← Format & Return
     → BookCover Component → Try sources in order:
        1. Firebase coverImage URL
        2. Open Library API (by ISBN)
        3. Google Books API (by title/author)
        4. SVG Fallback (generated)
```

#### 3. Add Book Flow (User Library)
```
User → Add Book Form → Frontend → Backend API
                                 → Create in Firestore
                                 → Sync to PostgreSQL (background)
                                 ← Return book data
     ← Success → Redirect to Library
```

#### 4. Favorites Flow
```
User → Click Heart Icon → Frontend → Backend API
                                    → Check Firestore index
                                    → Add to favorites collection
                                    → Sync to PostgreSQL
                                    ← Success
     ← Update UI → Show in Favorites
```

### Database Schema

#### Firestore Collections

**users**
- uid (string, primary key)
- email (string)
- displayName (string)
- photoURL (string)
- createdAt (timestamp)
- updatedAt (timestamp)

**books**
- id (auto-generated)
- title (string)
- author (string)
- isbn (string)
- description (text)
- coverImage (string, URL)
- genres (array)
- price (number)
- publicationDate (date)
- rating (number)
- totalRatings (number)
- createdAt (timestamp)

**user_books** (Personal Library)
- id (auto-generated)
- userId (string, indexed)
- bookId (string, nullable - null for custom books)
- title (string)
- author (string)
- status (enum: 'to-read', 'currently-reading', 'read')
- personalRating (number)
- personalReview (text)
- progress (number)
- dateStarted (date)
- dateFinished (date)
- isCustomBook (boolean)
- createdAt (timestamp)
- updatedAt (timestamp, indexed)

**favorites**
- id (auto-generated)
- userId (string, indexed)
- bookId (string)
- createdAt (timestamp, indexed)

**Required Firestore Indexes:**
1. Collection: `favorites`, Fields: `userId` (Asc) + `createdAt` (Desc)
2. Collection: `user_books`, Fields: `userId` (Asc) + `updatedAt` (Desc)

### Image Loading Strategy

The BookCover component implements a **smart waterfall loading strategy**:

```typescript
1. Try Firebase coverImage URL (if exists in database)
   ↓ (if fails or empty)
2. Try Open Library by ISBN
   → https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
   ↓ (if fails)
3. Try Google Books API
   → Search by title/author → Extract thumbnail URL
   ↓ (if fails)
4. Try Open Library by title
   → https://covers.openlibrary.org/b/title/{title}-L.jpg
   ↓ (if all fail)
5. Generate SVG Fallback
   → Beautiful gradient with book title and genre
```

### Dual-Database Architecture

**Why Two Databases?**

1. **Firebase Firestore (Primary)**
   - Real-time data synchronization
   - Offline support
   - Easy integration with Firebase Auth
   - Fast reads/writes
   - Auto-scaling

2. **Azure PostgreSQL (Secondary)**
   - Complex analytical queries
   - Reporting and analytics
   - Data backup
   - Relational data integrity
   - Business intelligence

**Synchronization Strategy:**
- All writes go to Firebase (primary)
- Background sync to PostgreSQL (non-blocking)
- If PostgreSQL sync fails → log warning, continue
- PostgreSQL used for analytics only
- No read queries depend on PostgreSQL sync

### Network Architecture
```
Internet → Azure NSG (Firewall)
    ↓ (Ports: 22, 3000, 5000)
Bastion Host (52.176.217.99)
    ↓
Docker Compose Network
    ├─ Frontend Container :3000
    ├─ Backend Container :5000
    └─ Internal Bridge Network
         ↓
External Services
    ├─ Firebase (Primary DB + Auth)
    ├─ Azure PostgreSQL (Secondary DB)
    ├─ Open Library API (Images)
    └─ Google Books API (Images)
```

### Security Features

- **Authentication**: Firebase JWT tokens
- **Authorization**: Middleware checks on all protected routes
- **Network**: Azure NSG with restricted ports
- **Database**: Firebase security rules + PostgreSQL encryption
- **Secrets**: Environment variables, never committed
- **CORS**: Configured for frontend domain only
- **Input Validation**: Backend validation on all inputs

### Application Stack

**Frontend (React 18)**
- Modern React hooks (useState, useEffect, useContext)
- TypeScript for type safety
- Bootstrap 5 for responsive UI
- Axios for API calls
- React Router for navigation
- Context API for state management
- Smart image loading with BookCover component
- Port: 3000

**Backend (Node.js 20 + Express)**
- RESTful API design
- Express 5.1.0 with ES6 modules
- Firebase Admin SDK
- PostgreSQL client (pg)
- JWT authentication middleware
- Error handling middleware
- Dual-database service layer
- Port: 5000

**Database**
- Azure PostgreSQL 15.14
- SSL-encrypted connections
- Managed backups
- Tables: users, books, favorites, user_books

---

##  DevOps Pipeline

### CI Pipeline (Pull Requests)
Automatically runs on every pull request:

1. **Code Quality Checks**
   - ESLint for JavaScript/React
   - Prettier formatting validation

2. **Security Scanning**
   - **Trivy**: Container vulnerability scanning
   - **tfsec**: Terraform security analysis
   - Fails build on HIGH/CRITICAL vulnerabilities

3. **Testing**
   - Unit tests (frontend & backend)
   - Integration tests
   - API endpoint validation

### CD Pipeline (Master Branch)
Automatically deploys on merge to master:

1. **Build Phase**
   - Build Docker images (frontend + backend)
   - Tag with Git commit SHA
   - Push to Azure Container Registry

2. **Security Phase**
   - Re-run Trivy scans on production images
   - Verify no new vulnerabilities introduced

3. **Deploy Phase**
   - Authenticate to Azure
   - Run Ansible playbook
   - Pull latest images from ACR
   - Deploy with Docker Compose
   - Health checks and verification

**Deployment Time**: ~5-7 minutes from merge to live

---

##  Setup Instructions

### Prerequisites

- Azure account with active subscription
- Terraform >= 1.0
- Ansible >= 2.9
- Docker >= 20.10
- Git
- GitHub account

### 1. Clone Repository

```bash
git clone https://github.com/Lydia02/summative-a-react-discovery-app-Lydia02.git
cd E-Library
```

### 2. Configure Azure Credentials

Create a service principal:

```bash
az ad sp create-for-rbac --name "e-library-sp" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}
```

Add to GitHub Secrets:
- `AZURE_CLIENT_ID`
- `AZURE_CLIENT_SECRET`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_TENANT_ID`

### 3. Configure GitHub Secrets

Required secrets for CI/CD:

```
AZURE_CLIENT_ID          # Service principal client ID
AZURE_CLIENT_SECRET      # Service principal secret
AZURE_SUBSCRIPTION_ID    # Azure subscription ID
AZURE_TENANT_ID          # Azure tenant ID
ACR_LOGIN_SERVER         # elibraryacr2dgk5j.azurecr.io
DB_HOST                  # PostgreSQL hostname
DB_PORT                  # 5432
DB_NAME                  # elibrarydb
DB_USER                  # Database username
DB_PASSWORD              # Database password
FIREBASE_SERVICE_ACCOUNT # Firebase service account JSON
```

### 4. Provision Infrastructure

```bash
cd terraform

# Initialize Terraform
terraform init

# Review planned changes
terraform plan

# Apply infrastructure
terraform apply

# Note outputs (bastion IP, ACR name, etc.)
terraform output
```

### 5. Configure Ansible Inventory

Update `ansible/hosts.ini`:

```ini
[bastion]
52.176.217.99 ansible_user=azureuser ansible_ssh_private_key_file=~/.ssh/bastion_key

[app_servers]
52.176.217.99 ansible_user=azureuser ansible_ssh_private_key_file=~/.ssh/bastion_key
```
### 6. Manual First Deployment (Optional)

```bash
cd ansible

# Test connection
ansible -i hosts.ini bastion -m ping

# Run playbook
ansible-playbook -i hosts.ini deploy.yml
```

### 7. Trigger Automated Deployment

```bash
# Make any code change
echo "# Update" >> README.md

# Commit and push
git add .
git commit -m "feat: trigger deployment"
git push origin master

# Watch GitHub Actions tab for deployment
```

---


##  Security Features

### Infrastructure Security
-  Private VNet with subnet isolation
-  Network Security Groups (NSG) with minimal ports
-  Bastion host for secure SSH access
-  Private container registry (ACR)
-  SSL-encrypted database connections
-  Service principal with least privilege

### Application Security
-  Non-root Docker containers
-  Read-only file systems where possible
-  Environment variable secrets (not hardcoded)
-  Firebase Admin SDK for authentication
-  PostgreSQL with SSL required

### DevSecOps
-  Trivy scanning for container vulnerabilities
-  tfsec scanning for IaC security issues
-  Automated security checks on every PR
-  Build fails on HIGH/CRITICAL issues
-  Dependency vulnerability monitoring

---

##  Testing

### Run Tests Locally

**Frontend Tests**
```bash
cd frontend
npm install
npm test
```

**Backend Tests**
```bash
cd backend
npm install
npm test
```

### API Endpoint Testing

```bash
# Health check
curl http://52.176.217.99:5000

# Get books
curl http://52.176.217.99:5000/api/books

# Create user (requires auth token)
curl -X POST http://52.176.217.99:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

---

##  Troubleshooting

### Container Issues

**Check container status:**
```bash
ssh azureuser@52.176.217.99
cd /opt/e-library
docker-compose ps
```

**View logs:**
```bash
docker-compose logs frontend
docker-compose logs backend
```

**Restart services:**
```bash
docker-compose restart
```

### Database Connection Issues

**Test connection from bastion:**
```bash
psql "host=elibrary-postgresql.postgres.database.azure.com \
      port=5432 \
      dbname=elibrarydb \
      user=elibraryuser \
      sslmode=require"
```

### Pipeline Failures

**Common issues:**

1. **Azure authentication fails**
   - Verify service principal credentials in GitHub Secrets
   - Check subscription ID is correct

2. **Trivy scan fails**
   - Review scan output for vulnerabilities
   - Update base images or dependencies

3. **Ansible deployment fails**
   - Check SSH connectivity to bastion
   - Verify Docker is installed on target VM
   - Check file permissions for serviceAccountKey.json

### Network Issues

**Check NSG rules:**
```bash
az network nsg rule list \
  --resource-group e-library-rg \
  --nsg-name bastion-nsg \
  --output table
```

**Test connectivity:**
```bash
# From local machine
curl -I http://52.176.217.99:3000
curl -I http://52.176.217.99:5000

# Should return HTTP 200 OK
```

---

##  Monitoring & Logs

### Application Logs

**Frontend (Nginx)**
```bash
docker logs elibrary-frontend --tail 100 -f
```

**Backend (Node.js)**
```bash
docker logs elibrary-backend --tail 100 -f
```

### Database Logs

Access via Azure Portal:
1. Navigate to Azure PostgreSQL resource
2. Click "Logs" in left menu
3. View server logs and slow query logs

### CI/CD Pipeline Logs

- GitHub Actions tab in repository
- Click on workflow run for detailed logs
- Download logs for offline analysis

---

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- Firebase account with Firestore enabled
- Git for version control

### Installation

1. Clone the repository
```sh
   git clone https://github.com/Lydia02/E-Library.git
   cd E-Library
```

2. Install frontend dependencies
```bash
cd E-Library/frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Configure environment variables
   - Create .env file in frontend/ directory (see .env.example)
   - Create .env file in backend/ directory (see .env.example)
   - Add your Firebase configuration credentials

5. Run the application

*Frontend:*
```bash
cd frontend
npm run dev
```

*Backend:*
```bash
cd backend
npm run dev
```

### Running with Docker
*Prerequisite:*
- Docker and Docker Compose installed ([Get Docker](https://docs.docker.com/get-docker/))
- Create .env file in backend/ directory with Firebase credentials

*Quick Start:*
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

*Access the application:*
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Usage

How to use the application:

1. Open http://localhost:5173 to access the frontend.
2. Register a new account
![Register New User](./frontend/public/Screenshots/register.png)

---

3. log in
![Login](./frontend/public/Screenshots/login.png)

---
4. Browse books
![Browse Books](./frontend/public/Screenshots/browse-books.png)

---
5. Add a book
![Add Book](./frontend/public/Screenshots/add-book.png)

---
6. Favorite books
![Favorite books](./frontend/public/Screenshots/favorites.png)
4. Admins can manage users and books from the dashboard.

## Project Structure

```
E-Library/
|
├── .github
│   └── workflows
│       ├── cd-deploy.yml
│       └── ci.yml
|
├── ansible
│   ├── group_vars
│   │   └── all
│   │       └── vars.yml
│   ├── ansible.cfg
│   ├── deploy.yml
│   ├── inventory.yml
│   └── playbook.yml
|
|
├── backend
│   ├── src
│   │   ├── config
│   │   │   ├── database.js
│   │   │   └── firebase.js
|   |   |
│   │   ├── controllers
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bookController.js
│   │   │   ├── favoriteController.js
│   │   │   ├── reviewController.js
│   │   │   └── userBookController.js
│   │   ├── database
│   │   │   ├── migrate.js
│   │   │   └── schema.sql
│   │   ├── middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bookRoutes.js
│   │   │   ├── favoriteRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   └── userBookRoutes.js
│   │   ├── scripts
│   │   │   └── populateBooks.js
│   │   ├── services
│   │   │   ├── bookService.js
│   │   │   ├── favoriteService.js
│   │   │   ├── profileService.js
│   │   │   ├── reviewService.js
│   │   │   └── userBookService.js
│   │   ├── utils
│   │   │   ├── pagination.js
│   │   │   ├── response.js
|   |   |   ├── validation.js
│   │   │   └── validation.test.js
|   |   |   
│   │   ├── index.js
│   │   └── server.js
│   ├── .dockerignore
|   ├── .env.example
│   ├── .gitignore
|   ├── Dockerfile
|   ├── jest.config.js
|   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── test-db-connections.js
│   └── test-postgres-operations.js
│
├── frontend/
│   ├── public/
│   │   ├── bookhub-logo.svg
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── assets/
|   |   |   ├── e-library-architecture.svg
│   │   │   └── react.svg
|   |   |
│   │   ├── components/
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookCover.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.css
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ToastContainer.tsx
│   │   │
│   │   ├── config/
│   │   │   └── api.ts
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AddBookPage.tsx
│   │   │   ├── AddCommunityBookPage.tsx
│   │   │   ├── BookDetailPage.tsx
│   │   │   ├── BooksPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EditBookPage.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── HomePage.css
│   │   │   ├── HomePage.tsx
│   │   │   ├── LibraryPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   └── SignupPage.tsx
│   │   │
│   │   ├── redux/
│   │   │   ├── filterSlice.ts
│   │   │   ├── hooks.ts
│   │   │   └── store.ts
│   │   │
│   │   ├── routes/
│   │   │   └── AppRouter.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── bookCoverService.ts
│   │   │   ├── bookService.ts
│   │   │   ├── favoritesService.ts
│   │   │   ├── profileService.ts
│   │   │   └── userBooksService.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   └── bookCoverGenerator.ts
│   │   │
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── setupTests.ts
│   │
│   ├── .gitignore
|   ├── .dockerignore
|   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
|   ├── nginx.conf
│   ├── MIGRATION_COMPLETE.md
│   ├── package-lock.json
│   ├── package.json
|   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
|   ├── vite.config.ts
│   ├── vitest.config.ts│
|
├── terraform
│   ├── .terraform.lock.hcl
│   ├── acr.tf
│   ├── nsg.tf
│   ├── outputs.tf
│   ├── postgresql.tf
│   ├── providers.tf
│   ├── resource_group.tf
│   ├── variables.tf
│   ├── vm.tf
│   └── vnet.tf
|
├── .gitattributes
├── .gitignore
├── LICENSE
├── README.md
├── package-lock.json
├── package.json
└── docker-compose.yml
```
---
## License

MIT License

