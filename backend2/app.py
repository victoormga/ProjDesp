import os
import pymysql
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Modelo de datos
class Tarea(BaseModel):
    id: int
    descripcion: str

# Función para obtener la conexión a MySQL
def get_connection():
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST", "mysql"),
        user=os.getenv("MYSQL_USER", "user"),
        password=os.getenv("MYSQL_PASSWORD", "userpass"),
        database=os.getenv("MYSQL_DATABASE", "tareasdb"),
        cursorclass=pymysql.cursors.DictCursor
    )

# Inicializa la base de datos: crea la tabla si no existe
def init_db():
    connection = get_connection()
    with connection.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tareas (
                id INT PRIMARY KEY,
                descripcion TEXT
            )
        """)
    connection.commit()
    connection.close()

# Llamada al inicio de la aplicación
init_db()

@app.get("/api/tareas/")
def listar_tareas():
    connection = get_connection()
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM tareas")
        tareas = cursor.fetchall()
    connection.close()
    return {"backend": "backend2", "tareas": tareas}

@app.get("/api/tareas/{tarea_id}")
def obtener_tarea(tarea_id: int):
    connection = get_connection()
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM tareas WHERE id = %s", (tarea_id,))
        tarea = cursor.fetchone()
    connection.close()
    if tarea is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarea no encontrada")
    return {"backend": "backend2", "tarea": tarea}

@app.post("/api/tareas/")
def crear_tarea(t: Tarea):
    connection = get_connection()
    with connection.cursor() as cursor:
        try:
            cursor.execute("INSERT INTO tareas (id, descripcion) VALUES (%s, %s)", (t.id, t.descripcion))
        except pymysql.err.IntegrityError:
            connection.close()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID ya existe")
    connection.commit()
    connection.close()
    return {"backend": "backend2", "tarea": t}

@app.delete("/api/tareas/{tarea_id}")
def eliminar_tarea(tarea_id: int):
    connection = get_connection()
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM tareas WHERE id = %s", (tarea_id,))
    connection.commit()
    connection.close()
    return {"backend": "backend2", "mensaje": "Tarea eliminada"}

@app.put("/api/tareas/{tarea_id}")
def actualizar_tarea(tarea_id: int, t: Tarea):
    connection = get_connection()
    with connection.cursor() as cursor:
        cursor.execute("UPDATE tareas SET descripcion = %s WHERE id = %s", (t.descripcion, tarea_id))
    connection.commit()
    connection.close()
    return {"backend": "backend2", "tarea": t}
