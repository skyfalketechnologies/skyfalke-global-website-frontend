#!/bin/bash

# Production Deployment Script for Skyfalke Backend
# Usage: ./deploy.sh [production|staging]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
APP_NAME="skyfalke-backend"
DOCKER_IMAGE="skyfalke-backend:latest"

echo -e "${BLUE}🚀 Starting deployment for ${ENVIRONMENT} environment...${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

# Stop existing container if running
if docker ps -q -f name=$APP_NAME | grep -q .; then
    print_warning "Stopping existing container..."
    docker stop $APP_NAME
    docker rm $APP_NAME
fi

# Remove old image if exists
if docker images -q $DOCKER_IMAGE | grep -q .; then
    print_warning "Removing old Docker image..."
    docker rmi $DOCKER_IMAGE
fi

# Build new Docker image
print_status "Building Docker image..."
docker build -t $DOCKER_IMAGE .

# Start container with docker-compose
print_status "Starting container with docker-compose..."
docker-compose up -d

# Wait for container to be ready
print_status "Waiting for container to be ready..."
sleep 10

# Health check
print_status "Running health check..."
if node health-check-comprehensive.js --url http://localhost:5000; then
    print_status "Health check passed!"
else
    print_error "Health check failed!"
    print_warning "Container logs:"
    docker logs $APP_NAME
    exit 1
fi

# Show container status
print_status "Container status:"
docker ps -f name=$APP_NAME

print_status "Deployment completed successfully!"
print_status "API is available at: http://localhost:5000"
print_status "Health check: http://localhost:5000/api/health"
print_status "WebSocket test: http://localhost:5000/api/ws-test"

echo -e "${BLUE}📊 To view logs: docker logs -f $APP_NAME${NC}"
echo -e "${BLUE}🛑 To stop: docker-compose down${NC}"
