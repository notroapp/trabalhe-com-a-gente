FROM node:22-alpine AS build
WORKDIR /app
ARG FRONTEND_GRAPHQL_URL
ENV FRONTEND_GRAPHQL_URL=${FRONTEND_GRAPHQL_URL}
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
