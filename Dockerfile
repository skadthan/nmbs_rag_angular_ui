# Build Stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Angular app files
COPY . .

# Clean and build the app with SSR
RUN rm -rf dist && \
    npm run clean && \
    npm run build:ssr && \
    ls -la dist/nmbs-rag-angular-ui/server/

# Serve Stage
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built application
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 4000

# Start the SSR application
ENV PORT=4000
CMD ["node", "dist/nmbs-rag-angular-ui/server/server.mjs"]