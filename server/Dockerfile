FROM node:22-alpine as development
WORKDIR /app

COPY . .
RUN ["npm", "install"]

EXPOSE 3000
ENTRYPOINT ["/bin/sh", "-c", "npm run dev"]
