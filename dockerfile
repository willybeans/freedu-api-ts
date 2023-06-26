# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

