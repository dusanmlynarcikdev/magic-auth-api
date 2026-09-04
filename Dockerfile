# ----
# Base
# ----
FROM node:26-alpine AS base

WORKDIR /app

COPY package*.json .

# ------------
# Dependencies
# ------------
FROM base AS dependencies

RUN npm ci

# -----------------------
# Production dependencies
# -----------------------
FROM base AS production-dependencies

RUN npm ci --omit=dev

# ---
# App
# ---
FROM dependencies AS app

COPY . .

# -----
# Build
# -----
FROM app AS build

RUN npm run build

# ----------
# Production
# ----------
FROM base AS production

COPY --from=build /app/dist ./dist
COPY --from=production-dependencies /app/node_modules ./node_modules
