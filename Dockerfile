FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/scripts ./scripts

EXPOSE 4000
ENV PORT=4000
ENV NODE_ENV=production

# Auth env vars — set these in Railway dashboard
# AUTH_USER, AUTH_PASS, COOKIE_SECRET, DATABASE_URL

CMD ["sh", "-c", "node scripts/migrate.mjs && node dist/app/server/server.mjs"]
