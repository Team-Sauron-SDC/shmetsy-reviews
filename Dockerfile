FROM node:current-slim

# Set the working directory
WORKDIR /app

COPY package.json .

RUN npm install

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]

COPY . ./
