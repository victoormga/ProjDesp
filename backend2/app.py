from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Tarea(BaseModel):
    id: int
    descripcion: str

tareas: List[Tarea] = []
contador = 1

@app.get("/api/tareas/")
def listar_tareas():
    return {"backend": "backend2", "tareas": tareas}

@app.get("/api/tareas/{id}")
def obtener_tarea(id: int):
    for tarea in tareas:
        if tarea.id == id:
            return {"backend": "backend2", "tarea": tarea}
    raise HTTPException(status_code=404, detail="Tarea no encontrada")

@app.post("/api/tareas/")
def crear_tarea(t: Tarea):
    tareas.append(t)
    return {"backend": "backend2", "tarea": t}

@app.delete("/api/tareas/{id}")
def eliminar_tarea(id: int):
    global tareas
    tareas = [t for t in tareas if t.id != id]
    return {"backend": "backend2", "mensaje": "Eliminada"}

@app.put("/api/tareas/{id}")
def actualizar_tarea(id: int, t: Tarea):
    for i, tarea in enumerate(tareas):
        if tarea.id == id:
            tareas[i] = t
            return {"backend": "backend2", "tarea": t}
    raise HTTPException(status_code=404, detail="Tarea no encontrada")
