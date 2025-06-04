# backend/Dockerfile

# 1. Base image
FROM node:22-alpine

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package manifests
COPY package.json package-lock.json ./

# 4. Install dependencies (uses lockfile for reproducibility)
RUN npm ci --production

# 5. Copy application source
COPY index.js ./

# 6. Expose port and launch
EXPOSE 3000
CMD ["node", "index.js"]
