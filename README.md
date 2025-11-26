# E-library

*"Empowering African learners through accessible digital education"*

A digital library platform that provides students and readers with easy access to educational materials anytime, anywhere.

[![CI Pipeline](https://github.com/Lydia02/summative-a-react-discovery-app-Lydia02/actions/workflows/ci.yml/badge.svg)](https://github.com/Lydia02/summative-a-react-discovery-app-Lydia02/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/Lydia02/summative-a-react-discovery-app-Lydia02/actions/workflows/cd-deploy.yml/badge.svg)](https://github.com/Lydia02/summative-a-react-discovery-app-Lydia02/actions/workflows/cd-deploy.yml)
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

- *Frontend*: React 18, TypeScript, Vite, Redux Toolkit
- *Backend*: Node.js 20+, Express 5.1.0, ES6 Modules
- *Database*: Firebase Firestore (NoSQL)
- *Authentication*: Firebase Authentication
- *Styling*: CSS3, Responsive Design
- *Version Control*: Git, GitHub
- *DevOps*: GitHub Projects, Branch Protection, CI/CD (planned)

##  Architecture Overview

![E-Library Architecture](./e-library-architecture.svg)

### Infrastructure Components

| Component | Technology | Details |
|-----------|-----------|---------|
| **Cloud Provider** | Microsoft Azure | Global cloud infrastructure |
| **IaC Tool** | Terraform | Infrastructure provisioning |
| **Container Registry** | Azure ACR | Private image repository |
| **Compute** | Azure VM | Bastion host (Ubuntu 22.04) |
| **Database** | Azure PostgreSQL | Managed database service (v15.14) |
| **Authentication** | Firebase | Admin SDK integration |
| **Configuration Mgmt** | Ansible | Automated deployment |
| **CI/CD** | GitHub Actions | Automated pipelines |
| **Containerization** | Docker & Docker Compose | Application packaging |

---

##  Architecture Details

### Network Architecture
```
Internet → NSG (Ports 3000, 5000, 22)
    ↓
Bastion Host (52.176.217.99)
    ↓
Docker Compose (Frontend + Backend)
    ↓
PostgreSQL Database + Firebase Auth
```

### Application Stack

**Frontend**
- React 18 with modern hooks
- Nginx web server
- Responsive UI with Tailwind CSS
- Port: 3000

**Backend**
- Node.js 20 with Express
- RESTful API design
- PostgreSQL integration
- Firebase Admin SDK
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
│   ├── vitest.config.ts
│   │
│   ├── BRANCH_01_README.md
│   ├── BRANCH_02_README.md
│   ├── BRANCH_03_README.md
│   ├── BRANCH_04_README.md
│   ├── BRANCH_06_README.md
│   ├── BRANCH_07_README.md
│   ├── BRANCH_08_README.md
│   ├── BRANCH_09_README.md
│   ├── BRANCH_10_README.md
│   ├── BRANCH_11_README.md
│   ├── BRANCH_12_README.md
│   ├── BRANCH_13_README.md
│   ├── BRANCH_14_README.md
│   └── BRANCH_15_README.md
│
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
├── MIGRATION_PLAN.md
├── README.md
├── package-lock.json
├── package.json
└── docker-compose.yml
```

## Links

- [Live frontend](http://52.176.217.99:3000)
- [Live Backend](http://52.176.217.99:5000)
- [Project Board](https://github.com/Lydia02/E-Library/projects)
- [Repository](https://github.com/Lydia02/E-Library)
- [Issues](https://github.com/Lydia02/E-Library/issues)
- [Azure Portal](https://portal.azure.com)
- [Project Demo Video]()

##  Documentation

- [Terraform Docs](./terraform/README.md)
- [Ansible Playbook Guide](./ansible/README.md)
- [API Documentation](./backend/API.md)
- [Frontend Components](./frontend/COMPONENTS.md)

---


## License

MIT License

**Academic Integrity**: All DevOps configuration files (Terraform, Ansible, GitHub Actions, Dockerfiles, docker-compose) were written by the team without AI assistance, in compliance with course policies.

---

##  Course Information

**Course**: Advanced DevOps  
**Institution**: African Leadership University  
**Project Type**: Summative Assessment  
**Submission Date**: November 2025

---

##  Acknowledgments

- ALU DevOps instructors for guidance
- Azure for cloud infrastructure
- Open source community for tools and libraries

---

**Last Updated**: November 26, 2025  
**Version**: 1.0.0  
**Status**: Production Ready 
