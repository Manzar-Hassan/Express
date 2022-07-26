import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 4000;
// const MONGO_URL = "mongodb://localhost";  //node 16 and below
const MONGO_URL = "mongodb://127.0.0.1";

app.use(express.json());

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
  response.send(result);
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
    .updateOne({ id: id }, {$set: data});
  response.send(result);
});

app.delete("/movies/:id", async (request, response) => {
  //db.movies.deleteOne({id: "101"})
  const { id } = request.params;

  const movie = await client
    .db("B36WD")
    .collection("movies")
    .deleteOne({ id: id });

  movie
    ? response.send(movie)
    : response.status(404).send({ msg: "movie not found" });
});

app.listen(PORT, () => console.log(`App started in ${PORT}`));
