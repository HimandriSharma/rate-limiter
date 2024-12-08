import express from "express";
import { customRedisRateLimiter } from "./middleware";

const app = express();
const port = 4000;
app.use(customRedisRateLimiter);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript Node Express!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
