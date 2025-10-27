# E-library

A digital library platform that provides students and readers with easy access to educational materials anytime, anywhere.

## African Context

Access to educational materials in many parts of Africa remains limited due to high costs, poor distribution, and lack of modern infrastructure. The e-Library project bridges this gap by offering a centralized digital platform where learners, teachers, and researchers can access, share, and manage books and academic resources online.
By promoting open access and resource sharing, the e-Library supports digital learning and literacy growth across African schools and communities.

## Team Members

- [Lydia Subuola Ojoawo] - [Role] - [Student ID]
- [Nadia Teta] - [Role] - [Student ID]
- [Ann Dumo Peter Lau] - [Role] - [Student ID]

## Project Overview

The e-Library is a web-based application that allows users to browse, search, and read digital books and learning materials. It simplifies how students and educators access educational content by storing resources in one place.
Users can explore available books, view details (author, category, publication date), and read them. The system aims to enhance knowledge accessibility while supporting digital transformation in African education systems.

### Target Users
- Students in schools and universities
- Teachers and academic researchers
- Community learners seeking self-education

### Core Features
- Book Catalog: Browse and search for books by title, author, or category.
- Add book: Admins can add or manage e-books and documents.
- User Authentication: Register, log in, and manage user access.

## Technology Stack

- **Backend**: [e.g., Python/Django, Node.js/Express]
- **Frontend**: [Typescript, React]
- **Database**: [e.g., PostgreSQL, MongoDB]
- **Other**: [Any other key technologies]

## Getting Started

### Prerequisites
- [e.g., Python 3.9+, Node.js 16+]
- [Any other requirements]

### Installation

1. Clone the repository
```bash
   git clone https://github.com/Lydia02/E-Library.git
   cd E-Library
```

2. Install dependencies
```sh
npm install
```
3. Create an environment file
Create a .env file in the root directory and add:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

4. Run the application
```bash
   npm run dev
```

### Usage

[How to use the application - include examples if applicable]

## Project Structure
```
E-Library/
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
│   ├── eslint.config.js
│   ├── index.html
│   ├── MIGRATION_COMPLETE.md
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
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
└── README.md
```

## Links

- [Project Board](link-to-github-projects)
- [Documentation](if applicable)

## License

MIT License