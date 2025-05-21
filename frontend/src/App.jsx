import { useState, useEffect } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [contador, setContador] = useState(1);

  const fetchTareas = async () => {
    try {
      const res = await fetch("/api/tareas/");
      const data = await res.json();
      setTareas(data.tareas || []);
    } catch (err) {
      console.error("Error cargando tareas:", err);
    }
  };

  const crearTarea = async () => {
    if (!descripcion.trim()) return;

    try {
      const res = await fetch("/api/tareas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contador, descripcion }),
      });

      const responseData = await res.json();
      console.log("RESPUESTA DE CREAR:", responseData);

      setContador(contador + 1);
      setDescripcion("");
      await fetchTareas();
    } catch (err) {
      console.error("Error al crear tarea:", err);
    }
  };

  const eliminarTarea = async (id) => {
    try {
      const res = await fetch(`/api/tareas/${id}`, { method: "DELETE" });
      const responseData = await res.json();
      console.log("RESPUESTA DE ELIMINAR:", responseData);

      await fetchTareas();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Gestor de Tareas</h1>
      <input
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button onClick={crearTarea}>Crear</button>

      <ul>
        {tareas.map((t) => (
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
