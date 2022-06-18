// require express, cors, db relative path(after db.js setup)
// set app to call express
// middleware
// routes/endpoints
// app.listen to check if server is running

const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");
const errorMiddleware = require("./error-middleware");
const ClientError = require("./client-error");

app.use(cors());
app.use(express.json());

// ROUTES (CRUD)

// create a todo
app.post("/api/todos", (req, res, next) => {
  const { description } = req.body;
  if (!description)
    throw new ClientError(400, "request must include a description");
  const sql = `
  insert into "todos"
  ("description")
  values
  ($1)
  returning *
  `;
  const params = [description];
  db.query(sql, params)
    .then((result) => {
      const finalResult = {
        status: "success",
        results: result.rows.length,
        data: {
          todos: results.rows,
        },
      };
      res.json(finalResult);
    })
    .catch((err) => next(err));
});

// get all todos
// app.get("/todos", (req, res) => {
//   const sql = `
//   select * from todos
//   `;
//   db.query(sql)
//     .then(result => {
//       const todos = result.rows;
//       res.json(todos);
//     })
//     .catch((err) => console.error(err));
// });

app.get("/api/todos", (req, res, next) => {
  const sql = `
  select * from "todos"
  `;
  db.query(sql)
    .then((result) => {
      const todos = result.rows;
      res.json(todos);
    })
    .catch((err) => next(err));
});

// get a todo

app.get("/api/todos/:id", (req, res) => {
  const { id } = req.params; // change to req.body when the rest of the code is up
  if (!id) throw new ClientError(400, `cannot find todo with id ${id}`);
  const sql = `
  select "description"
  from "todos"
  where "todo_id" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then((result) => {
      const todo = result.rows[0];
      res.json(todo);
    })
    .catch((err) => console.error(err.message));
});
// update a todo
// delete a todo

app.listen(5000, () => {
  console.log("server started on port 5000");
});
