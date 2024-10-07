import "./reset.css";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import CheckAllAndRemaining from "./components/CheckAllAndRemaining";
import FliterTodos from "./components/FliterTodos";
import ClearupTodos from "./components/ClearupTodos";
import { useCallback, useEffect, useState } from "react";

function App() {
  let [todos, setTodos] = useState([]);
  let [filteredTodos, setFilteredTodos] = useState(todos);

  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
        setFilteredTodos(todos);
      });
  }, []);

  let filterBy = useCallback(
    (filter) => {
      if (filter === "All") {
        setFilteredTodos(todos);
      }
      if (filter === "Active") {
        setFilteredTodos(todos.filter((t) => !t.completed));
      }
      if (filter === "Completed") {
        setFilteredTodos(todos.filter((t) => t.completed));
      }
    },
    [todos]
  );

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

  let updateTodo = (todo) => {
    fetch(`http://localhost:3001/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    setTodos((prevState) => {
      return prevState.map((t) => {
        if (t.id === todo.id) {
          return todo;
        }
        return t;
      }); // [updatedTodo,todo,todo]
    });
  };

  let remainingCount = todos.filter((todo) => !todo.completed).length;

  let CheckAll = () => {
    todos.forEach((t) => {
      t.completed = true;
      updateTodo(t);
    });

    setTodos((prevState) => {
      return prevState.map((t) => {
        return { ...t, completed: true };
      });
    });
  };

  let clearCompleted = () => {
    todos.forEach((t) => {
      if (t.completed) {
        deleTodo(t.id);
      }
    });
    setTodos((prevState) => {
      return prevState.filter((t) => !t.completed);
    });
  };

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo Web</h2>
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={filteredTodos}
          deleTodo={deleTodo}
          updateTodo={updateTodo}
        />
        <CheckAllAndRemaining
          remainingCount={remainingCount}
          CheckAll={CheckAll}
        />
        <div className="other-buttons-container">
          <FliterTodos filterBy={filterBy} />
          <ClearupTodos clearCompleted={clearCompleted} />
        </div>
      </div>
    </div>
  );
}

export default App;
