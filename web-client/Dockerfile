# Stage 1: Build the SvelteKit application
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Copy pnpm-lock.yaml and package.json files
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Build the app
RUN pnpm run build

# Stage 2: Create the production image
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Copy the build output from the builder stage
COPY --from=builder /usr/src/app/.SvelteKit ./build
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/.env ./

# SvelteKit might generate static files that need to be served
# Copy them if they exist
COPY --from=builder /usr/src/app/static ./static

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Expose the port that your app will run on
ENV PORT=3000

# Start the app
CMD ["pnpm", "start", "--port", "$PORT"]