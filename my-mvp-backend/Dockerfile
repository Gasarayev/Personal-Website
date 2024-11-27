# Use official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port your app will run on (default 3000 for Express)
EXPOSE 3000

# Set environment variables (optional)
ENV NODE_ENV=production

# Run the application using nodemon for development
CMD ["npm", "start"]
