import express, { Express } from "express";
const port = 8000;

const app: Express = express();

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.listen(port, () => {
  console.log(`server is running at : ${port}`);
});
