# # Base image
# FROM node:18.16.0-alpine

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json (if available)
# COPY package*.json ./

# # Install PM2 globally and other dependencies
# RUN npm install -g pm2 && npm install

# # Copy the rest of the application code
# COPY . .

# # # Build the React application
# # RUN npm run build

# # Expose the port your app runs on
# EXPOSE 3000

# # Start the application using PM2
# CMD ["pm2-runtime", "start", "npm", "--", "start"]



FROM node:18-alpine

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# 🔥 Fix npm network timeout (CRITICAL)
RUN npm config set fetch-timeout 600000 \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set registry https://registry.npmjs.org/ \
 && npm ci

# Copy remaining source code
COPY . .

# Build frontend
RUN npm run build

# Expose app port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
