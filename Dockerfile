FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]