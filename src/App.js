import "./reset.css";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import CheckAllAndRemaining from "./components/CheckAllAndRemaining";
import FliterTodos from "./components/FliterTodos";
import ClearupTodos from "./components/ClearupTodos";
import { useEffect, useState } from "react";
import { upload } from "@testing-library/user-event/dist/upload";

function App() {
  let [todos, setTodos] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((res) => res.json())
      .then((todos) => setTodos(todos));
  }, []);

  let addTodo = (todo) => {
    //serversite data upload

    fetch("http://localhost:3001/todos", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(todo),
    });

    //clientsite data upload
    setTodos((preState) => [...preState, todo]);
  };

  let deleTodo = (todoID) => {
    // server
    fetch(`http://localhost:3001/todos/${todoID}`, {
      method: "DELETE",
    });
    // client
    setTodos((preState) => {
      return preState.filter((todo) => {
        return todo.id !== todoID;
      });
    });
  };

  let updateTodo = (uploadTodo) => {
    fetch(`http://localhost:3001/todos/${uploadTodo.id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(updateTodo),
    });

    setTodos((prevState) => {
      return prevState.map((t) => {
        if (t.id === uploadTodo.id) {
          return uploadTodo;
        }
        return t;
      });
    });
  };
  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo Web</h2>
        <TodoForm addTodo={addTodo} />
        <TodoList todos={todos} deleTodo={deleTodo} updateTodo={updateTodo} />
        <CheckAllAndRemaining />
        <div className="other-buttons-container">
          <FliterTodos />
          <ClearupTodos />
        </div>
      </div>
    </div>
  );
}

export default App;
