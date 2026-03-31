# BookStore

A full-featured e-commerce web application for browsing and purchasing books, built with React and Tailwind CSS.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment & Configuration](#environment--configuration)
- [Pages & Routes](#pages--routes)
- [Authentication](#authentication)
- [AI Chatbot](#ai-chatbot)
- [API Services](#api-services)

---

## Overview

BookStore is a responsive single-page application that provides a complete online bookstore experience. Users can browse a catalog, view individual book details, manage a cart and wishlist, place orders, and track order history. An embedded AI-powered chatbot (BookBot) assists users in finding books and navigating the store.

---

## Features

- **Book Catalog** — Responsive grid display with cover images, author, description, and price
- **Product Detail Pages** — Per-book view with wishlist and cart actions
- **Shopping Cart** — Add/remove items, live subtotal, shipping cost, and order total
- **Checkout Flow** — Order placement with address selection
- **Order Tracking** — Visual progress bar (Confirmed → Processing → Shipped → Out for Delivery → Delivered)
- **Wishlist** — Save books for later
- **User Profile** — View/edit personal info and manage saved addresses (Home, Office, Other)
- **Settings** — Account preferences
- **Admin Panel** — User management dashboard (admin-only)
- **AI Chatbot (BookBot)** — Floating chat widget with streaming AI responses
- **JWT Authentication** — Token-based login/logout with automatic 401 redirect
- **Protected Routes** — Authenticated access control for all user-facing pages

---

## Tech Stack

| Category         | Technology                                                |
| ---------------- | --------------------------------------------------------- |
| Framework        | [React 18](https://react.dev/)                            |
| Build Tool       | [Vite 6](https://vitejs.dev/)                             |
| Routing          | [React Router DOM v7](https://reactrouter.com/)           |
| Styling          | [Tailwind CSS v3](https://tailwindcss.com/)               |
| HTTP Client      | [Axios](https://axios-http.com/)                          |
| Icons            | [React Icons](https://react-icons.github.io/react-icons/) |
| State Management | React Context API                                         |

---

## Project Structure

```
BookStore/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BookList.jsx          # Reusable book grid component
│   │   ├── chatbot.jsx           # AI chatbot widget (BookBot)
│   │   ├── FaSearchComponent.jsx # Header search UI
│   │   ├── FaUserComponent.jsx   # Header user dropdown
│   │   ├── Header.jsx            # Top navigation bar
│   │   └── ProtectedRoute.jsx    # Auth guard for private routes
│   ├── pages/
│   │   ├── Home.jsx              # Landing page with book catalog
│   │   ├── ProductPage.jsx       # Individual book detail
│   │   ├── Cart.jsx              # Shopping cart
│   │   ├── Checkout.jsx          # Order placement
│   │   ├── Orders.jsx            # Order history & tracking
│   │   ├── Wishlist.jsx          # Saved books
│   │   ├── Profile.jsx           # User profile & addresses
│   │   ├── Settings.jsx          # Account settings
│   │   ├── Login.jsx             # Login form
│   │   ├── Signup.jsx            # Registration form
│   │   ├── AdminPage.jsx         # Admin user management
│   │   └── HelpSupport.jsx       # Help & support page
│   ├── services/
│   │   ├── api.js                # Axios instance for backend (port 8080)
│   │   ├── auth.js               # Login / logout helpers
│   │   └── ai.js                 # Axios instance for AI service (port 5000)
│   ├── App.jsx                   # Root component, router, UserContext
│   ├── Layout.jsx                # Shared layout (Header, Footer, ChatBot)
│   └── main.jsx                  # React DOM entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- Backend API server running on `http://localhost:8080`
- *(Optional)* AI service running on `http://localhost:5000` for ChatBot functionality

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd BookStore

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build for Production

```bash
npm run build
```

Output is placed in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Environment & Configuration

The backend base URL is configured in `src/services/api.js`:

```js
baseURL: 'http://localhost:8080'
```

The AI service base URL is configured in `src/services/ai.js`:

```js
baseURL: 'http://localhost:5000'
```

Update these values to point to your deployed backend and AI service endpoints.

---

## Pages & Routes

| Path            | Page                | Access        |
| --------------- | ------------------- | ------------- |
| `/`             | Home — book catalog | Protected     |
| `/books`        | Book list           | Public        |
| `/product/:id`  | Book detail         | Public        |
| `/help`         | Help & Support      | Public        |
| `/login`        | Login               | Auth redirect |
| `/signup`       | Registration        | Auth redirect |
| `/cart/:userId` | Shopping cart       | Protected     |
| `/checkout`     | Checkout            | Protected     |
| `/wishlist`     | Wishlist            | Protected     |
| `/profile`      | User profile        | Protected     |
| `/orders`       | Order history       | Protected     |
| `/settings`     | Settings            | Protected     |
| `/admin`        | Admin panel         | Protected     |

---

## Authentication

Authentication uses **JWT tokens** stored in `localStorage`.

- On login, the token is saved via `localStorage.setItem('token', token)`
- Every API request automatically attaches the token as a `Bearer` header via an Axios request interceptor
- A response interceptor detects `401 Unauthorized` responses, clears the token, and redirects to `/login`
- `ProtectedRoute` checks for a valid token; unauthenticated users are redirected to `/login`
- Authenticated users visiting `/login` or `/signup` are redirected to `/`

---

## AI Chatbot

**BookBot** is a floating chat widget rendered globally in the layout. It connects to the AI service at `http://localhost:5000/stream-chat` and delivers **streamed, token-by-token** responses for a natural conversational experience.

Toggle the chatbot open or closed using the floating button in the bottom-right corner of every page.

---

## API Services

### Main Backend (`src/services/api.js`)

| Method   | Endpoint                        | Description              |
| -------- | ------------------------------- | ------------------------ |
| `GET`    | `/books/all`                    | Fetch all books          |
| `GET`    | `/books/id?id={id}`             | Fetch book by ID         |
| `GET`    | `/users/profile`                | Get current user profile |
| `GET`    | `/users/all`                    | Get all users (admin)    |
| `POST`   | `/users/login`                  | Authenticate user        |
| `GET`    | `/cart/all`                     | Get current user's cart  |
| `DELETE` | `/cart/remove/item?bookId={id}` | Remove item from cart    |
| `GET`    | `/cart/item?bookId={id}`        | Check if book is in cart |

### AI Service (`src/services/ai.js`)

| Method | Endpoint       | Description                  |
| ------ | -------------- | ----------------------------- |
| `POST` | `/stream-chat` | Stream chat response from AI |

