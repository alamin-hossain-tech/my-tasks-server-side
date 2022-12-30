const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 4000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

//mongodbapi
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rfyyfuu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//mongodb try function start---
async function run() {
  try {
    const taskCollection = client.db("MyTask").collection("Active_Tasks");

    // Add Tasks
    app.post("/add-task", async (req, res) => {
      const task = req.body;

      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    //Get Task
    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const state = req.query.state;
      const query = {
        userEmail: email,
        complete: state,
      };
      const cursor = taskCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });

    //edit task as complete or incomplete
    app.put("/task-complete", async (req, res) => {
      const id = req.query.id;
      const state = req.query.state;

      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedreview = {
        $set: {
          complete: state,
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedreview,
        option
      );
      res.send(result);
    });
    //edit task
    app.put("/task/edit/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedreview = {
        $set: {
          task_name: update.task_name,
          task_image: update.task_image,
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedreview,
        option
      );
      res.send(result);
    });

    // delete task by id
    app.post("/task/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    // --------------END---------------------
  } finally {
  }
}
run().catch((error) => console.log(error));

// Express
app.listen(port, () => {
  console.log("Server running on port", port);
});

app.get("/", (req, res) => {
  res.send("Server Running");
});
