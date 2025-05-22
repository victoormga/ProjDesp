from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pymysql
from typing import List

app = FastAPI()

# Configuración de la conexión a MySQL
def get_connection():
    return pymysql.connect(
        host="mysql",
        user="user",
        password="password",
        database="tareasdb",
        cursorclass=pymysql.cursors.DictCursor
    )

# Crear tabla si no existe
def init_db():
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tareas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    titulo VARCHAR(255),
                    descripcion TEXT
                )
            """)
        conn.commit()

init_db()

# Modelo Pydantic para una tarea
class Tarea(BaseModel):
    titulo: str
    descripcion: str

class TareaConID(Tarea):
    id: int

# Obtener todas las tareas
@app.get("/api/tareas/", response_model=List[TareaConID])
def obtener_tareas():
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM tareas")
            tareas = cursor.fetchall()
    return tareas

# Crear nueva tarea
@app.post("/api/tareas/", response_model=TareaConID)
def crear_tarea(tarea: Tarea):
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO tareas (titulo, descripcion) VALUES (%s, %s)",
                (tarea.titulo, tarea.descripcion)
            )
            tarea_id = cursor.lastrowid
        conn.commit()
    return {**tarea.dict(), "id": tarea_id}

# Obtener tarea por ID
@app.get("/api/tareas/{tarea_id}", response_model=TareaConID)
def obtener_tarea(tarea_id: int):
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM tareas WHERE id = %s", (tarea_id,))
            tarea = cursor.fetchone()
            if tarea is None:
                raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return tarea

# Eliminar tarea
@app.delete("/api/tareas/{tarea_id}")
def eliminar_tarea(tarea_id: int):
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM tareas WHERE id = %s", (tarea_id,))
        conn.commit()
    return {"mensaje": "Tarea eliminada"}

# Editar tarea
@app.put("/api/tareas/{tarea_id}", response_model=TareaConID)
def editar_tarea(tarea_id: int, tarea: Tarea):
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE tareas SET titulo = %s, descripcion = %s WHERE id = %s",
                (tarea.titulo, tarea.descripcion, tarea_id)
            )
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Tarea no encontrada")
        conn.commit()
    return {**tarea.dict(), "id": tarea_id}
