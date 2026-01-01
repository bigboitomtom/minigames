import fs from "fs";

type entry = {
  name: string,
  score: number,
  timeCreated: Date
}

export function addToLeaderboard(
  name: string,
  score: number,
  timeCreated: Date,
) {
  const entry: entry = {
    name: name,
    score: score,
    timeCreated: timeCreated
  }

  let leaderboard = [];

  if (fs.existsSync("memoryDictionary.json")) {
    leaderboard = JSON.parse(fs.readFileSync("memoryDictionary.json", "utf-8"));
  }

  leaderboard.push(entry);
  leaderboard.sort((a: entry, b: entry) => b.score - a.score);
  if (leaderboard.length > 10) {
    leaderboard.pop();
  }

  fs.writeFileSync("memoryDictionary.json", JSON.stringify(leaderboard, null, 2));
}
