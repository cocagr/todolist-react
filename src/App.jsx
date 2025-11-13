import { useState, useEffect } from "react";

const App = () => {
  const username = "josecc";
  const API_URL = `https://playground.4geeks.com/todo/users/${username}`;
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    createUser().then(() => loadTasks());
  }, []);

  const createUser = async () => {
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify([]),
        headers: { "Content-Type": "application/json" },
      });

      if (!resp.ok && resp.status !== 400) {
        throw new Error("Error creando usuario");
      } else if (resp.status === 400) {
        console.log("Usuario ya existe, continuando...");
      } else {
        console.log("Usuario creado correctamente");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadTasks = async () => {
    try {
      const resp = await fetch(API_URL);
      if (!resp.ok) throw new Error("Error al obtener tareas");
      const data = await resp.json();
      setTasks(data.todos || []);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    const task = { label: newTask, is_done: false };

    try {
      const resp = await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "POST",
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      });
      if (!resp.ok) throw new Error("Error al agregar tarea");
      await loadTasks();
      setNewTask("");
    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const resp = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Error al eliminar tarea");
      await loadTasks();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  const clearAllTasks = async () => {
    try {
      const resp = await fetch(API_URL, { method: "DELETE" });
      if (!resp.ok) throw new Error("Error al limpiar lista");
      setTasks([]);
    } catch (error) {
      console.error("Error limpiando lista:", error);
    }
  };

  const toggleTaskDone = async (id, newStatus) => {
    try {
      const resp = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_done: newStatus }),
      });
      if (!resp.ok) throw new Error("Error al actualizar tarea");
      await loadTasks();
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">Tareas</h1>

      <div className="todo-box">
        <input
          type="text"
          placeholder="¿Qué queda por hacer?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          className="todo-input"
        />

        <ul className="todo-list">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={task.is_done}
                  onChange={() => toggleTaskDone(task.id, !task.is_done)}
                />
                <span
                  style={{
                    textDecoration: task.is_done ? "line-through" : "none",
                    marginLeft: "10px",
                  }}
                >
                  {task.label}
                </span>
                <i
                  className="fa-solid fa-xmark delete-icon"
                  onClick={() => deleteTask(task.id)}
                ></i>
              </li>
            ))
          ) : (
            <li className="no-tasks">No hay tareas, añade una tarea</li>
          )}
        </ul>

        <div className="todo-footer">
          {tasks.filter(task => !task.is_done).length} {tasks.filter(task => !task.is_done).length === 1 ? "tarea" : "tareas"} por hacer
        </div>

        {tasks.length > 0 && (
          <button onClick={clearAllTasks} className="clear-btn">
            Limpiar todas las tareas
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
