FROM node:24-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 8080 for the WebSocket server
EXPOSE 8080

CMD [ "node", "index.js" ]
