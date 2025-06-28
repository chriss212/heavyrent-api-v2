# Heavy Rent API v2

A REST API for heavy equipment rental management built with NestJS and TypeScript.

## Features

- **User Authentication** - JWT-based authentication with Google OAuth support
- **Machine Management** - CRUD operations for heavy equipment
- **Rental System** - Create and manage equipment rental requests
- **API Documentation** - Swagger/OpenAPI documentation
- **Database** - PostgreSQL with TypeORM

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/google` - Google OAuth login

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

### Machines

- `GET /machines` - Get all machines
- `POST /machines` - Create new machine
- `GET /machines/:id` - Get machine by ID

### Rentals

- `GET /rentals` - Get user's rentals
- `POST /rentals` - Create rental request

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Documentation**: Swagger
- **Testing**: Jest

## License

This project is private and proprietary.
