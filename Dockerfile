# Use an official Node.js image as the base
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app's source code
COPY . .

# Expose port 5173 for Vite's dev server
EXPOSE 5173

# Command to start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
