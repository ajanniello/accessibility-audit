# Playwright base image has all system dependencies pre-installed
FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

# Install Node dependencies and Playwright's Chromium browser
COPY package*.json ./
RUN npm ci && npx playwright install chromium

# Copy source and build Next.js
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]