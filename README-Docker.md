# Docker Setup for ERP Application

This Docker setup runs both the frontend and backend applications in a single container using PM2 as a process manager.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run with database:**
   ```bash
   docker-compose up --build
   ```

2. **Run in background:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the image:**
   ```bash
   docker build -t erp-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3001:3001 -p 5173:5173 erp-app
   ```

## Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (if using docker-compose)

## Environment Variables

Create a `.env` file in the `backend/` directory with your database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=erp_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_jwt_secret_here
```

## Container Structure

The container runs two processes:
- **Backend**: Express.js server on port 3001
- **Frontend**: Vite preview server on port 5173

Both processes are managed by PM2 for reliability and process management.

## Development vs Production

- **Development**: Use `npm run dev` in separate terminals for hot reloading
- **Production**: Use this Docker setup for deployment

## Troubleshooting

1. **Port conflicts**: Make sure ports 3001, 5173, and 5432 are available
2. **Database connection**: Ensure your `.env` file has correct database credentials
3. **Build issues**: Check that all dependencies are properly installed

## Customization

You can modify the `Dockerfile` to:
- Change Node.js version
- Add additional dependencies
- Modify build process
- Change port configurations

## Security Notes

- Change default database passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production deployments 