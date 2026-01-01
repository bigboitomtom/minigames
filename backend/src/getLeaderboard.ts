import fs from "fs";

export function getLeaderboard() {
  return JSON.parse(String(fs.readFileSync("memoryDictionary.json")));
}