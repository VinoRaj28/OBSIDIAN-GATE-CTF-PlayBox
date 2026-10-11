FROM node:18-alpine
WORKDIR /app
COPY app/package.json package.json
RUN npm install
COPY app/ .
EXPOSE 8090
CMD ["node", "server.js"]
