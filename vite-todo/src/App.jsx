import { useState } from "react";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newTask.trim() !== "") {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const deleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">todos</h1>

      <div className="todo-box">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          className="todo-input"
        />

        <ul className="todo-list">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <li key={index} className="todo-item">
                {task}
                <i
                  className="fa-solid fa-xmark delete-icon"
                  onClick={() => deleteTask(index)}
                ></i>
              </li>
            ))
          ) : (
            <li className="no-tasks">No hay tareas, añadir tareas</li>
          )}
        </ul>

        <div className="todo-footer">
          {tasks.length} {tasks.length === 1 ? "item" : "items"} left
        </div>
      </div>
    </div>
  );
};

export default App;
