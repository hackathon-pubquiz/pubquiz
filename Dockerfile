FROM node:alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY server/ .

EXPOSE 8080
CMD ["node","server.js"]