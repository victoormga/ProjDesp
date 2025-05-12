import { useEffect, useState } from 'react';

function App() {
  const [tareas, setTareas] = useState([]);
  const [nueva, setNueva] = useState("");

  const fetchTareas = async () => {
    const res = await fetch("/api/tareas/");
    const data = await res.json();
    setTareas(data.tareas || []);
  };

  const crearTarea = async () => {
    if (!nueva.trim()) return;
    await fetch("/api/tareas/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion: nueva })
    });
    setNueva("");
    fetchTareas();
  };

  const eliminarTarea = async (id) => {
    await fetch(`/api/tareas/${id}`, { method: "DELETE" });
    fetchTareas();
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Gestor de Tareas</h1>
      <input value={nueva} onChange={e => setNueva(e.target.value)} />
      <button onClick={crearTarea}>Crear</button>
      <ul>
        {tareas.map(t => (
          <li key={t.id}>
            {t.descripcion}
            <button onClick={() => eliminarTarea(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
