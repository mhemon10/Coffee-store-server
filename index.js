const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jee5u80.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let coffeeCollection;

async function run() {
  try {
    await client.connect();
    const db = client.db("coffeeDB");
    coffeeCollection = db.collection("coffees");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error(err);
  }
}
run();

// 🔥 POST: Add Coffee
app.post("/coffees", async (req, res) => {
  const coffee = req.body;

  console.log("📥 Received coffee:", coffee);

  const result = await coffeeCollection.insertOne(coffee);

  console.log("✅ Insert result:", result);

  res.send(result);
});

app.get("/coffees", async (req, res) => {
  const result = await coffeeCollection.find().toArray();
  res.send(result);
});

// get single coffee
app.get("/coffees/:id", async (req, res) => {
  const id = req.params.id;
  const result = await coffeeCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});
//get dellet single coffee
app.delete("/coffees/:id", async (req, res) => {
  const id = req.params.id;
  const result = await coffeeCollection.deleteOne({
    _id: new ObjectId(id),
  });
  res.send(result);
});

// for update coffee
app.put("/coffees/:id", async (req, res) => {
  const id = req.params.id;
  const updatedCoffee = req.body;

  const result = await coffeeCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedCoffee },
  );

  res.send(result);
});
app.get("/", (req, res) => {
  res.send("Coffee server is running ☕");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
