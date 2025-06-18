# 1. Node.js公式イメージをベースに使用
FROM node:18

# 2. 作業ディレクトリを作成（この中で作業する）
WORKDIR /app

# 3. 依存パッケージの情報をコピーしてインストール
COPY package*.json ./
RUN npm install

# 4. ソースコード一式をコピー
COPY . .

# 5. Next.jsビルド
RUN npm run build

# 6. アプリのポートを開放（デフォルト:3000）
EXPOSE 3000

# 7. 開発モードで起動（本番なら "start" に変更可）
CMD ["npm", "run", "dev"]
