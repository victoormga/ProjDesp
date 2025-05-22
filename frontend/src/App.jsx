import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  const obtenerTareas = async () => {
    const res = await fetch("/api/tareas/");
    const data = await res.json();
    setTareas(data);
  };

  const crearTarea = async () => {
    if (!titulo.trim() || !descripcion.trim()) return;

    await fetch("/api/tareas/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion }),
    });

    setTitulo("");
    setDescripcion("");
    obtenerTareas();
  };

  const eliminarTarea = async (id) => {
    await fetch(`/api/tareas/${id}`, { method: "DELETE" });
    obtenerTareas();
  };

  const guardarEdicion = async (id) => {
    await fetch(`/api/tareas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: editTitulo,
        descripcion: editDescripcion,
      }),
    });

    setEditandoId(null);
    obtenerTareas();
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };

  const empezarEdicion = (tarea) => {
    setEditandoId(tarea.id);
    setEditTitulo(tarea.titulo);
    setEditDescripcion(tarea.descripcion);
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <div className="container">
      <h1>Gestor de Tareas</h1>
      <div className="form">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título de la tarea"
        />
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción de la tarea"
        />
        <button onClick={crearTarea}>Crear</button>
      </div>

      <ul className="lista">
        {tareas.map((t) => (
          <li key={t.id}>
            {editandoId === t.id ? (
              <>
                <input
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                />
                <button onClick={() => guardarEdicion(t.id)}>💾</button>
                <button onClick={cancelarEdicion}>❌</button>
              </>
            ) : (
              <>
                <strong>{t.titulo}</strong> {t.descripcion}
                <button onClick={() => empezarEdicion(t)}>✏️</button>
                <button className="delete" onClick={() => eliminarTarea(t.id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
