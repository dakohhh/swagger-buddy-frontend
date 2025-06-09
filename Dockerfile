FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json /package.json
COPY package-lock.json /package-lock.json

RUN npm install

COPY . .

RUN npm run build


FROM node:20-alpine as runner

WORKDIR /app

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/next-env.d.ts /app/next-env.d.ts
COPY --from=builder /app/next-env.d.ts /app/next-env.d.ts
COPY --from=builder /app/next.config.js /app/next.config.js
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/postcss.config.js /app/postcss.config.js
COPY --from=builder /app/tailwind.config.js /app/tailwind.config.js


RUN npm ci --production

CMD [ "npm", "run", "start:prod" ]