# Use an official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose your app port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
