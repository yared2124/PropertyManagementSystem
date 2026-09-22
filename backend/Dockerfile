# =============================================
# Stage 1: Builder — install deps & generate Prisma client
# =============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL (Prisma requirement on Alpine)
RUN apk add --no-cache openssl

# Copy dependency files first for better layer caching
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install ALL deps (including devDeps for prisma CLI)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# =============================================
# Stage 2: Production — minimal runtime image
# =============================================
FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

# Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src ./src

# Create uploads directory
RUN mkdir -p uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', r => r.statusCode === 200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
