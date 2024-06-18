FROM node:current-alpine AS development
WORKDIR /app

COPY . .
RUN ["npm", "install"]

EXPOSE 3000
CMD ["/bin/sh", "-c", "npm run dev"]