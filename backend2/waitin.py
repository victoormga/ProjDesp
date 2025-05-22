import time
import pymysql
import os

host = os.getenv("MYSQL_HOST", "mysql")
user = os.getenv("MYSQL_USER", "user")
password = os.getenv("MYSQL_PASSWORD", "userpass")
database = os.getenv("MYSQL_DATABASE", "tareasdb")

print("Esperando a que MySQL esté disponible...")
while True:
    try:
        conn = pymysql.connect(host=host, user=user, password=password, database=database)
        conn.close()
        print("¡MySQL está listo!")
        break
    except pymysql.err.OperationalError:
        print("MySQL aún no está disponible. Esperando 2s...")
        time.sleep(2)
