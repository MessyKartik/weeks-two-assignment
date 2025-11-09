require("dotenv").config();
const express = require("express");
const app = express();
const { google } = require("googleapis");
app.use(express.json());

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
  keyFile: "random-webhook-data-1060287c6407.json", // path to your service account JSON key
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SHEET_ID;

// Push data to Google Sheets
async function appendToSheet(data) {
  try {
    const values = [[new Date().toISOString(), data.eventType, data.initiator]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:C", // change if needed
      valueInputOption: "RAW",
      resource: { values },
    });

    console.log("Data added to Google Sheet:", values);
  } catch (error) {
    console.error("Error appending to Google Sheet:", error);
  }
}

const messages = [];

const authMiddleware = (req, res, next) => {
  const headers = req.headers;
  const secretHeader = headers["x-secret"];
  if (secretHeader !== process.env.WEBHOOK_SECRET) {
    return res.sendStatus(401);
  }
  next();
};

app.post("/git-info", authMiddleware, async (req, res) => {
  const data = req.body;
  messages.push(data);

  // Push each event in the array (in case webhook sends multiple)
  if (Array.isArray(data)) {
    for (const event of data) {
      await appendToSheet(event);
    }
  } else {
    await appendToSheet(data);
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  return res.json(messages);
});

const PORT = process.env.PORT || 5601;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
