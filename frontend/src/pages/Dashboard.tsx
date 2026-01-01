import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Box } from "@mui/material";

export function Dashboard() {
  const [name, setName] = useState<string>("");

  const handleClick = async () => {
    try {
      await fetch("http://localhost:5000/games/leaderboard/memorydictionary", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ name: name, score: 13, timeCreated: Date.now() }),
      });
      console.log(name);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Enter Name"
          onChange={(event) => setName(event.target.value)}
        />
        <button onClick={handleClick}>Submit</button>
      </Box>
    </Box>
  );
}
