# Use Node base image
FROM node:20-alpine

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy all code
COPY . .

# Expose ports
EXPOSE 5000 5173

# Install concurrently to run both
RUN npm install -g concurrently

# Start both servers
CMD concurrently "npm run startup --prefix backend" "npm run dev --prefix frontend"


