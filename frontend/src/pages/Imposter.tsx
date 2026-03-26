import { Box, Button, Typography } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { NumberField } from "../components/NumberField";
import { useEffect, useRef, useState } from "react";
import { ImposterCard } from "../components/ImposterCard";

const testWords: string[] = ["Giant", null as any, "Knight"];

type playerCard = {
  word: string;
  playerNum: number;
};

export function Imposter() {
  const [numPlayers, setNumPlayers] = useState<number>(3);
  const [allPlayerWord, setAllPlayerWord] = useState<string[]>(testWords);
  const [currPlayerCard, setCurrPlayerCard] = useState<playerCard>(); // Technically of type obj

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isStaging, setIsStaging] = useState<boolean>(false);

  const [wordOpened, setWordOpened] = useState<boolean>(false);

  const currPlayerIndex = useRef<number>(0);

  const handleNumPlayers = (value: number) => {
    setNumPlayers(value);
    console.log(numPlayers);
  };

  const handleToStaging = () => {
    setIsStaging(true);
  };

  const handleActiveGame = () => {
    setIsStaging(false);
    setIsActive(true);
  };

  const handleNewGame = () => {
    setIsStaging(true);
    setIsActive(false);
    currPlayerIndex.current = 0;
  };

  const handleReturnHome = () => {
    setIsStaging(false);
    setIsActive(false);
    currPlayerIndex.current = 0;
  };

  // Used for imposter card
  // Sets boolean if the card word has been revealed
  const handleOnOpen = () => {
    setWordOpened(true);
  };

  const handleNextPlayerCard = () => {
    setWordOpened(false);
    loadPlayerWord();
  };

  // Loads information of player word
  const loadPlayerWord = () => {
    const currWord = allPlayerWord[currPlayerIndex.current];
    console.log(currWord);
    const currPlayer: playerCard = {
      word: currWord,
      playerNum: currPlayerIndex.current + 1,
    };
    setCurrPlayerCard(currPlayer);
    currPlayerIndex.current += 1;
  };

  // For rendering first player
  useEffect(() => {
    if (!isStaging) return;
    loadPlayerWord();
  }, [isStaging]);

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
        {/* Rendering for inactive game */}
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
        {/* Rendering for game staging */}
        {!isActive && isStaging && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <ImposterCard
                item={currPlayerCard?.word}
                playerNum={currPlayerCard?.playerNum}
                onOpen={handleOnOpen}
              />
            </Box>
            {wordOpened &&
              (currPlayerCard?.playerNum !== numPlayers ? (
                <Button variant="contained" onClick={handleNextPlayerCard}>
                  Next Player
                </Button>
              ) : (
                <Button variant="contained" onClick={handleActiveGame}>
                  Begin
                </Button>
              ))}

            {/* <Button variant="contained" onClick={handleActiveGame}>
              Begin
            </Button> */}
          </Box>
        )}
        {/* Rendering for active game  */}
        {isActive && !isStaging && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h1">Active game time</Typography>
            <Button variant="contained" onClick={handleNewGame}>
              New Game
            </Button>
            <Button variant="contained" onClick={handleReturnHome}>
              Back to Home
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
