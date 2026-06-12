// server.js
// Task Manager API - Project 2 (Backend API Development)
// This file sets up a simple Express server with endpoints to manage tasks.

const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to let Express understand JSON data sent in requests
app.use(express.json());

// Temporary in-memory storage for tasks (acts like a mini database for now)
let tasks = [
  { id: 1, title: "Learn Express basics", completed: false },
  { id: 2, title: "Build first API endpoint", completed: true }
];

// Keeps track of the next id to assign to a new task
let nextId = 3;

// ROUTE 1: Home route - just to check if server is running
app.get("/", (req, res) => {
  res.send("Task Manager API is running. Try /tasks to see all tasks.");
});

// ROUTE 2: GET /tasks - returns the full list of tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// ROUTE 3: GET /tasks/:id - returns a single task by its id
app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const foundTask = tasks.find((task) => task.id === taskId);

  if (!foundTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(foundTask);
});

// ROUTE 4: POST /tasks - adds a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Basic validation: title must exist and not be empty
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }

  const newTask = {
    id: nextId,
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);
  nextId++;

  res.status(201).json(newTask);
});

// ROUTE 5: PUT /tasks/:id - updates an existing task (e.g., mark as completed)
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const foundTask = tasks.find((task) => task.id === taskId);

  if (!foundTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, completed } = req.body;

  // Only update fields that were actually provided
  if (title !== undefined) {
    if (title.trim() === "") {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    foundTask.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be true or false" });
    }
    foundTask.completed = completed;
  }

  res.status(200).json(foundTask);
});

// ROUTE 6: DELETE /tasks/:id - removes a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  // 204 means success but nothing to send back
  res.status(204).send();
});

// Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Task Manager API is running on http://localhost:${PORT}`);
});