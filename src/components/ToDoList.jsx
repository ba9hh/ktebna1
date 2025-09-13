// src/components/TodoList.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos on load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("todos").select("*");
    if (error) console.error(error);
    else setTodos(data);
  };

  const addTodo = async () => {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: newTodo, completed: false }])
      .select();
    if (error) console.error(error);
    else setTodos([...todos, ...data]);
    setNewTodo("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Todo List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex gap-2 items-center">
            <span>{todo.title}</span>
            {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          className="border p-2"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo"
        />
        <button className="bg-blue-500 text-white p-2" onClick={addTodo}>
          Add
        </button>
      </div>
    </div>
  );
}
