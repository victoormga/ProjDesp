# Script para esperar a que MySQL esté listo antes de iniciar el backend

import time
import pymysql
import os

# Obtener variables de entorno o usar valores por defecto
host = os.getenv("MYSQL_HOST", "mysql")
user = os.getenv("MYSQL_USER", "user")
password = os.getenv("MYSQL_PASSWORD", "userpass")
database = os.getenv("MYSQL_DATABASE", "tareasdb")

# Bucle que espera hasta que la base de datos esté disponible
print("Esperando a que MySQL esté disponible...")
while True:
    try:
        # Intentar conectarse a la base de datos
        conn = pymysql.connect(host=host, user=user, password=password, database=database)
        conn.close()
        print("¡MySQL está listo!")
        break
    except pymysql.err.OperationalError:
        # Si falla, esperar 2 segundos antes de intentar de nuevo
        print("MySQL aún no está disponible. Esperando 2s...")
        time.sleep(2)
