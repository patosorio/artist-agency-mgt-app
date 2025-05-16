# Artist Management Agency App

A modern multi-tenant artist management agency application built with Next.js frontend and FastAPI backend.

## Architecture

### Frontend
- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
- [React Hook Form](https://react-hook-form.com/) - Form Handling
- [Zod](https://zod.dev/) - Schema Validation

### Backend
- [Django](https://www.djangoproject.com/) - Python web framework
- [Django ORM](https://docs.djangoproject.com/en/stable/topics/db/models/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Containerization
- [Firebase](https://firebase.google.com/) - Authentication and real-time features (e.g., notifications, chat)

## Features

- Multi-tenant Architecture
- Booking Management
- Contract Handling
- Invoice Management
- Artist Profiles
- Venue Management
- Promoter Management
- Expense Tracking
- Revenue Overview
- Payment & Invoice:
  - Stripe payment for Booking fee
  - Option for Artist fee payment via Artist's personal Stripe link (for self-employed artists)
  - Automatic reminder emails for Booking Fee and Artist Fee payments
  - Automated invoice creation reminders for Artists
- Contract Management:
  - DocuSign or similar e-signature integration
  - Pre-built contract templates with automatic booking information population
- Artist Management:
  - Action plan template system
  - Customizable objectives with timeframe selection
  - Personalized tracking metrics (countries, promoters, gig count, revenue, etc.)
  - Collaborative task management between artists and managers
  - Progress tracking and follow-up system

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.11+
- Docker and Docker Compose
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env.local file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a .env file:
```bash
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cabina
SECRET_KEY=your-secret-key-here
```

3. Start the services with Docker Compose:
```bash
docker-compose up -d
```

4. Run database migrations:
```bash
docker-compose exec api alembic upgrade head
```

5. Create a superuser (first tenant admin):
```bash
docker-compose exec api python -m scripts.create_superuser
```

## Project Structure

```
cabina-agency/
├── client/                # Frontend - Next.js
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utilities and Redux store
│   └── hooks/           # Custom React hooks
│
└── backend/             # Backend - Django
    ├── manage.py        # Django project management
    ├── project/         # Django project settings
    ├── apps/            # Django apps (bookings, artists, etc.)
    ├── requirements.txt
    └── docker-compose.yml
```

## API Documentation

Once the backend is running, you can access:
- API documentation: http://localhost:8000/docs
- Alternative documentation: http://localhost:8000/redoc

## Multi-tenant Features

### Tenant Isolation
- Every user belongs to a tenant (agency)
- All data models include tenant_id and are filtered accordingly
- Firebase authentication is used for secure access and user management
- API endpoints enforce tenant isolation through Django middleware and permissions

### Tenant Management
- Create new tenants with admin users
- Manage tenant-specific configurations
- Handle tenant onboarding flow
- Monitor tenant usage and activity

## Development

### Frontend Development
- Components use shadcn-ui for consistent styling
- State management with Redux Toolkit
- Form handling with React Hook Form and Zod

### Backend Development
- FastAPI for high-performance async API
- SQLAlchemy for database operations
- Pydantic for data validation
- Alembic for database migrations
- Docker for containerization

> **Note:** Backend is now Django with PostgreSQL, and Firebase is used for authentication and real-time features.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 