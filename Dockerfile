# Use the official Playwright image — Chromium + all system deps pre-installed
FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build Next.js
COPY . .
RUN npm run build

# Browsers live at /ms-playwright in this base image
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]
