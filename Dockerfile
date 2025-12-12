# Multi-stage build for production
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S skyfalke -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --chown=skyfalke:nodejs server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy server code and built client
COPY --chown=skyfalke:nodejs server/ ./
COPY --from=build --chown=skyfalke:nodejs /app/client/build ./public

# Switch to non-root user
USER skyfalke

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
