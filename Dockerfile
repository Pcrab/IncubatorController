FROM node:slim as build-stage
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN mkdir /app
WORKDIR /app
RUN npm install -g @vue/cli

COPY package.json .
RUN npm install

COPY . .
# RUN pnpm build
RUN npm run build

FROM nginx
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
