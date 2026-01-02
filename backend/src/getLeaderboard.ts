import fs from "fs";

export function getLeaderboard() {
  if (!fs.existsSync("memoryDictionary.json")) {
    return null;
  } else {
    return JSON.parse(String(fs.readFileSync("memoryDictionary.json")));
  }
}