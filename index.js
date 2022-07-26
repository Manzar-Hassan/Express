import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

//console.log(process.env) //env -> environment variables

const app = express();
const PORT = process.env.PORT;
// const MONGO_URL = "mongodb://localhost";  //node 16 and below
// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(cors()) //cross origin request sharing

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongodb connected!!💖");

  return client;
}

const client = await createConnection();

app.get("/", function (request, response) {
  response.send("<h1>Hello world!!</h1>");
});

app.post("/movies", async (request, response) => {
  //db.movies.find({})
  const data = request.body;
  const result = await client.db("B36WD").collection("movies").insertMany(data);

  result.insertedCount > 0
    ? response.send({ msg: "movies created sucessfully!!" })
    : response.status(404).send({ msg: "movie not found" });
});

app.get("/movies", async (request, response) => {
  //db.movies.find({})
  //console.log(request.query)

  if (request.query.rating) {
    request.query.rating = +request.query.rating;
  }

  const result = await client
    .db("B36WD")
    .collection("movies")
    .find(request.query)
    .toArray();
  response.send(result);
});

app.get("/movies/:id", async (request, response) => {
  const { id } = request.params;
  // const movie = data.find((movie) => movie.id === id);

  const movie = await client
    .db("B36WD")
    .collection("movies")
    .findOne({ id: id });

  movie
    ? response.send(movie)
    : response.status(404).send({ msg: "movie not found" });
});

app.put("/movies/:id", async (request, response) => {
  //db.movies.find({})
  const { id } = request.params;
  const data = request.body;
  const result = await client
    .db("B36WD")
    .collection("movies")
    .updateOne({ id: id }, { $set: data });

  result.modifiedCount > 0
    ? response.send({ msg: "movie updated sucessfully!!" })
    : response.status(404).send({ msg: "movie not found" });
});

app.delete("/movies/:id", async (request, response) => {
  //db.movies.deleteOne({id: "101"})
  const { id } = request.params;

  const movie = await client
    .db("B36WD")
    .collection("movies")
    .deleteOne({ id: id });

  movie.deletedCount > 0
    ? response.send({ msg: "movie deleted sucessfully!!" })
    : response.status(404).send({ msg: "movie not found" });
});

app.listen(PORT, () => console.log(`App started in ${PORT}`));
