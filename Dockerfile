FROM node:18.19.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_DISABLE_ESLINT=1

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]