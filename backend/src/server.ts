import express, { json, Request, Response } from "express"; 
import cors from "cors";
import morgan from "morgan";
import process from "process";
import { addToLeaderboard } from "./addToLeaderboard";
import { getLeaderboard } from "./getLeaderboard";

const app = express();
const PORT = 5000;
const HOST = "127.0.0.1";

app.use(cors());
app.use(json());
app.use(morgan("dev"));

app.post("/games/leaderboard/memorydictionary", (req: Request, res: Response) => {
  const { name, score, timeCreated } = req.body;
  try {
    return res.json(addToLeaderboard(name, score, timeCreated));
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

app.get("/games/leaderboard/memorydictionary", (req: Request, res: Response) => {
  try {
    return res.json(getLeaderboard());
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
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


