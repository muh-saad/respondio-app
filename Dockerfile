# Use an official Node.js runtime as the base image
FROM node:19

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all app source code to the container
COPY . .

# Expose the port that your app is listening on
EXPOSE 3000
