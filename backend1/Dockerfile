# Imagen base de Python ligera (slim)
FROM python:3.10-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de dependencias
COPY requirements.txt .

# Instala las dependencias especificadas sin guardar la caché
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código al contenedor
COPY . .

# Copia el script de espera (espera a que MySQL esté disponible)
COPY waitin.py .

# Comando que ejecuta el backend: espera a MySQL y luego lanza FastAPI con Uvicorn
CMD ["sh", "-c", "python waitin.py && uvicorn app:app --host 0.0.0.0 --port 5001"]
