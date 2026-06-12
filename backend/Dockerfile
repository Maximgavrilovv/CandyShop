FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nest build
RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found after build" && exit 1)

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY tsconfig.json nest-cli.json ./
RUN npm install --save-dev ts-node tsconfig-paths typescript
EXPOSE 3000
CMD ["node", "dist/main.js"]
