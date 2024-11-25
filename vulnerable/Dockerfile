# Base Image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .


# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
