# Imagen base de Nginx
FROM nginx:alpine

# Copia el archivo de configuración personalizado de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia los certificados SSL al contenedor
COPY certs /etc/nginx/certs

# Copia los archivos del frontend compilado al directorio público de Nginx
COPY frontend/dist /usr/share/nginx/html
