# ── Étape 1 : Build Angular ─────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copier package.json en premier pour profiter du cache Docker
COPY package*.json ./
RUN npm ci

# Copier le reste et builder en mode production
COPY . .
RUN npx ng build --configuration production

# ── Étape 2 : Servir avec nginx ──────────────────────────────────
FROM nginx:alpine

# Angular 17+ place les fichiers dans dist/<projet>/browser
COPY --from=build /app/dist/airbnb-clone-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
