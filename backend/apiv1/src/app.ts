import express from 'express';

const app = express();

app.get("/", (req, res) => {
  res.send("Solidar API Receivers V1 online!");
});

app.listen(3000, () => {
  console.log("Solidar API Receivers V1 listening on port 3000!");
});