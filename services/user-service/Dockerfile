FROM node:20-alpine
WORKDIR /app
COPY ../../package.json ../../pnpm-lock.yaml* ./
COPY package.json ./
RUN npm install --production --legacy-peer-deps || true
COPY src ./src
CMD ["node", "src/server.ts"]
