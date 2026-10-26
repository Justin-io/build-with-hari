# =================================================================
# BUILD WITH HARI — PRODUCTION BACKEND API FOR GOOGLE CLOUD RUN
# =================================================================

FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install production dependencies and tsx execution runtime
COPY package*.json ./
RUN npm install --omit=dev && npm install tsx

# Copy backend application source code and pricing engine
COPY server.ts ./
COPY src/server ./src/server
COPY src/utils/pricing.ts ./src/utils/pricing.ts

# Cloud Run security best practice: run as non-root user
USER node

EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/api/healthz || exit 1

CMD ["npx", "tsx", "server.ts"]
