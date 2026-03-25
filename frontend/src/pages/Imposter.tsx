import { Box, Button, Typography } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { NumberField } from "../components/NumberField";
import { useState } from "react";

export function Imposter() {
  const [numPlayers, setNumPlayers] = useState(3);

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
        <Typography variant="h3" sx={{ marginBottom: "20px" }}>
          Imposter (Clash Royale Edition)
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <NumberField label="Number of Players" size="small" min={3} max={8} onChange={(value) => console.log(value)}/>
          <Button
            variant="contained"
            sx={{
              width: "100%",
              margin: "0 auto",
            }}
          >
            Start Game
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
