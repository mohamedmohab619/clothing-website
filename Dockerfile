FROM node:22-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json .
RUN npm install

# The rest of the files are volume-mounted via docker-compose, 
# COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
