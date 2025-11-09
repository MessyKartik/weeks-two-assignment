import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Ok",
    message:
      "Simple Express.js API that can receive POST data via a webhook",
  });
});

app.post("/webhook", (req, res) => {
  try {
    const data = req.body;

    console.log("📩 Received Webhook Data:", data);

    res.status(200).json({
      success: true,
      message: "Webhook received successfully",
      receivedData: data,
    });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


