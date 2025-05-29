FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY certs /etc/nginx/certs
COPY frontend/dist /usr/share/nginx/html
