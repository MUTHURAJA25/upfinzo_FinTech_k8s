# Use lightweight Node image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install -g nodemon \
    && npm install

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 5001

# Start backend with nodemon
CMD ["nodemon", "--legacy-watch", "npm", "run", "dev"]