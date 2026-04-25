# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose port (3000 as configured in server.js)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD [ "npm", "start" ]
