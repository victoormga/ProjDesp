import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Estados para la lista de tareas y los inputs de creación
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Estados para edición de una tarea
  const [editandoId, setEditandoId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  // Obtener todas las tareas desde el backend
  const obtenerTareas = async () => {
    const res = await fetch("/api/tareas/");
    const data = await res.json();
    setTareas(data);
  };

  // Crear una nueva tarea
  const crearTarea = async () => {
    if (!titulo.trim() || !descripcion.trim()) return;

    await fetch("/api/tareas/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion }),
    });

    // Limpiar inputs y recargar lista
    setTitulo("");
    setDescripcion("");
    obtenerTareas();
  };

  // Eliminar una tarea por su ID
  const eliminarTarea = async (id) => {
    await fetch(`/api/tareas/${id}`, { method: "DELETE" });
    obtenerTareas();
  };

  // Guardar una tarea editada
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

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null);
  };

  // Comenzar edición llenando los estados con los datos actuales
  const empezarEdicion = (tarea) => {
    setEditandoId(tarea.id);
    setEditTitulo(tarea.titulo);
    setEditDescripcion(tarea.descripcion);
  };

  // Cargar tareas al cargar el componente
  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <div className="container">
      <h1>Gestor de Tareas</h1>

      {/* Formulario para crear tarea */}
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

      {/* Lista de tareas */}
      <ul className="lista">
        {tareas.map((t) => (
          <li key={t.id}>
            {editandoId === t.id ? (
              <>
                {/* Formulario de edición */}
                <input
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                />
                <textarea
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  placeholder="Descripción de la tarea"
                  rows={3}
                  style={{
                    resize: "vertical",
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    maxWidth: "100%",
                  }}
                />
                <button onClick={() => guardarEdicion(t.id)}>💾</button>
                <button onClick={cancelarEdicion}>❌</button>
              </>
            ) : (
              <>
                {/* Vista de tarea */}
                <div
                  style={{
                    maxWidth: "600px",
                    width: "100%",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ display: "block", marginBottom: "0.5rem", color: "gold" }}>
                      {t.titulo}
                    </strong>
                    <p
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                        overflowY: "auto",
                        maxHeight: "150px",
                        margin: 0,
                      }}
                    >
                      {t.descripcion}
                    </p>
                  </div>
                  {/* Botones de editar y eliminar */}
                  <div>
                    <button onClick={() => empezarEdicion(t)}>✏️</button>
                    <button className="delete" onClick={() => eliminarTarea(t.id)}>🗑️</button>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
