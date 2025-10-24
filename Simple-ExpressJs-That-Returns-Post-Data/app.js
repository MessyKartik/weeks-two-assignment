import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());

//Welcome Page
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome — This is Home Page",
    timestamp: new Date().toISOString(),
  });
});

//Get External Data
app.get("/products", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    res.status(200).json({
      source: "Data From FakeStoreAPI",
      count: response.data.length,
      data: response.data,
    });
  } catch (error) {
    console.error("Error Fetching Products", error.message);
    res.status(500).json({
      error: "Failed To Fetch Products",
      details: error.message,
    });
  }
});

//Not Found Page
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
  });
});

export default app;
