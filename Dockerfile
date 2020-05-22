FROM node:latest

# Set the working directory
WORKDIR usr/src/app

COPY package*.json ./

RUN  npm install
RUN  npm install -g grunt-cli
COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["grunt"]
# CMD /bin/bash ./wait-for-it.sh 127.0.0.1:3306 -- grunt