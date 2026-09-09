# ==============================================================================
# ICS C Programming Learning Lab — Production Multi-Stage Dockerfile
# ==============================================================================
# Stage 1: Base & Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build Next.js Web App
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Production Runner Image
FROM node:20-alpine AS runner
WORKDIR /app

# Install GCC, Clang, and build tools needed for local C execution fallback
RUN apk add --no-cache gcc clang musl-dev libc-dev python3 make

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create non-root system user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/execution-service ./execution-service

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
