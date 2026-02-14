# Stage 1: Build
FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-slim
WORKDIR /app

# 本番用の依存関係のみをインストール
COPY package.json package-lock.json ./
RUN npm ci --production

# ビルド成果物とサーバーコードをコピー
COPY --from=build /app/dist ./dist
COPY server ./server

EXPOSE 8080

# 環境変数はCloud Runで設定
CMD ["node", "server/index.js"]
