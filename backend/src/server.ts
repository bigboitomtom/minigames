import express, { json, Request, Response } from "express"; 
import cors from "cors";
import process from "process";

const app = express();
const PORT = 5000;
const HOST = "127.0.0.1";

app.use(cors());
app.use(json());

app.post("/games/memorydictionary", (req: Request, res: Response) => {
  const { name, score, timeCreated } = req.body;
  
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Server started on ${PORT} at ${HOST}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Shutting down server gracefully.");
    process.exit();
  });
});


