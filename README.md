# E-library

*"Empowering African learners through accessible digital education"*

A digital library platform that provides students and readers with easy access to educational materials anytime, anywhere.

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
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── firebase.js
│   │   ├── controllers
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bookController.js
│   │   │   ├── favoriteController.js
│   │   │   ├── reviewController.js
│   │   │   └── userBookController.js
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
│   └── README.md 
│
├── frontend/
│   ├── public/
│   │   ├── bookhub-logo.svg
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── assets/
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
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
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
├── .gitattributes
├── .gitignore
├── LICENSE
├── MIGRATION_PLAN.md
├── README.md
└── docker-compose.yml
```

## Links

- [Project Board](https://github.com/Lydia02/E-Library/projects)
- [Repository](https://github.com/Lydia02/E-Library)
- [Issues](https://github.com/Lydia02/E-Library/issues)

## License

MIT License