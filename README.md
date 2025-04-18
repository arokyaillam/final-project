# Clean Next.js Application

A clean and minimal Next.js 14+ application with App Router, featuring MongoDB (Mongoose), Axios, React Query, Redux, and shadcn/ui.

## Features

- **Next.js 14+** with App Router
- **MongoDB** with Mongoose for database operations
- **Axios** for HTTP requests
- **React Query** for data fetching and caching
- **Redux** (Redux Toolkit) for global state management
- **shadcn/ui** for UI components
- Clean and minimal folder structure

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/nextjs-app
```

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── app/            # App Router pages and layouts
│   │   ├── api/        # API routes
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   │   ├── db/         # Database utilities
│   │   └── providers/  # React providers
│   ├── services/       # API services
│   ├── store/          # Redux store and slices
│   └── utils/          # Helper functions
├── .env.local          # Environment variables (not in git)
└── README.md           # Project documentation
```

## MongoDB Connection

The application includes a MongoDB connection utility at `src/lib/db/mongodb.js`. The connection is established when the API routes are called.
