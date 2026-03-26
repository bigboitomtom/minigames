import { Box, Button, Typography } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { NumberField } from "../components/NumberField";
import { useState } from "react";

export function Imposter() {
  const [numPlayers, setNumPlayers] = useState<number>(3);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isStaging, setIsStaging] = useState<boolean>(false);

  const handleNumPlayers = (value: number) => {
    setNumPlayers(value);
    console.log(numPlayers);
  };

  const handleToStaging = () => {
    setIsStaging(true);
  }

  const handleActiveGame = () => {
    setIsStaging(false);
    setIsActive(true);
  }

  const handleNewGame = () => {
    setIsStaging(true);
    setIsActive(false);
  }

  const handleReturnHome = () => {
    setIsStaging(false);
    setIsActive(false);
  }

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
        {!isActive && !isStaging && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h3" sx={{ marginBottom: "20px" }}>
              Imposter (Clash Royale Edition)
            </Typography>
            <Box
              sx={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                margin: "0 auto",
                gap: "20px",
              }}
            >
              <NumberField
                label="Number of Players"
                defaultValue={3}
                size="small"
                min={3}
                max={8}
                onChange={(value) => handleNumPlayers(value)}
              />
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  margin: "0 auto",
                }}
                onClick={handleToStaging}
              >
                Start Game
              </Button>
            </Box>
          </Box>
        )}
        {!isActive && isStaging && (
          <Box sx={{display: "flex", flexDirection: "column" }}>
            <Typography variant="h1">Staging time</Typography>
            <Button variant="contained" onClick={handleActiveGame}>Begin</Button>
          </Box>
        )}
        {isActive && !isStaging && (
          <Box sx={{display: "flex", flexDirection: "column" }}>
            <Typography variant="h1">Active game time</Typography>
            <Button variant="contained" onClick={handleNewGame}>New Game</Button>
            <Button variant="contained" onClick={handleReturnHome}>Back to Home</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
