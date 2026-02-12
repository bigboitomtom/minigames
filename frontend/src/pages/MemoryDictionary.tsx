import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { generate } from "random-words";
import { useNavigate } from "react-router-dom";

const DEFAULT_SCORE = 0;
const DEFAULT_LIVES = 3;
const DEFAULT_HINTS = 5;
const DEFAULT_TIME = 10;

// Leaderboard entry
type entry = {
  name: string;
  score: number;
  timeCreated: Date;
};

/**
 * Helper function for generating a new word
 * @param dictionary
 * @param prevWord
 * @returns {string}
 */
const generateNewWord = (dictionary: string[], prevWord: string): string => {
  if (dictionary.length === 0) {
    return generate() as string;
  }

  const repeatIndex = Math.floor(Math.random() * (dictionary.length - 1));
  
  // Prevent infinite loop
  let attempts: number = 0;
  let currWord: string = generate() as string;
  while (attempts < 50) {
    const prob = Math.random();
    if (dictionary.length <= 15 && prob <= 0.2) {
      currWord = dictionary[repeatIndex];
    } else if (dictionary.length <= 25 && prob <= 0.3) {
      currWord = dictionary[repeatIndex];
    } else if (dictionary.length <= 35 && prob <= 0.4) {
      currWord = dictionary[repeatIndex];
    } else if (dictionary.length > 35 && prob <= 0.5) {
      currWord = dictionary[repeatIndex];
    }
    if (prevWord !== currWord) break;
    attempts++;
  }

  return currWord;
};

export function MemoryDictionary() {
  const navigate = useNavigate();
  const isSmall = useMediaQuery("(max-width:540px)");

  // State renders
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);

  // Score states
  const [score, setScore] = useState<number>(DEFAULT_SCORE);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("highScore") as string) || 0;
  });

  // Game variables
  const [currWord, setCurrWord] = useState<string>(generate() as string);
  const [lives, setLives] = useState<number>(DEFAULT_LIVES);
  const [hints, setHints] = useState<number>(DEFAULT_HINTS);
  const [dictionary, setDictionary] = useState<string[]>([]);

  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Leaderboard variables
  const [newRanking, setNewRanking] = useState<boolean>(false);
  const [rankName, setRankName] = useState<string>("");

  const seenWords = useRef<Set<string>>(new Set());
  const intervalRef = useRef<number | undefined>(-1);

  /**
   * Helper function to check if answer is correct or not
   * @param isMistake
   */
  const processAnswer = (isMistake: boolean): void => {
    if (isMistake) {
      const newLives = lives - 1;
      if (newLives === 0) {
        handleGameOver();
      } else {
        setLives((prevLives) => prevLives - 1);
      }
    } else {
      setScore((prevScore) => prevScore + 1);
    }

    // Check if word is in dictionary
    if (!seenWords.current.has(currWord)) {
      setDictionary((prevDictionary) => [...prevDictionary, currWord]);
      seenWords.current.add(currWord);
    }
    setCurrWord(generateNewWord(Array.from(seenWords.current), currWord));
    console.log("hi");
    setTimeLeft(DEFAULT_TIME);
  };

  /**
   * Event handler for adding a word
   */
  const handleAdd = () => {
    const isMistake = dictionary.includes(currWord);
    processAnswer(isMistake);
  };

  /**
   * Event handler for a seened word
   */
  const handleSeen = () => {
    const isMistake = !dictionary.includes(currWord);
    processAnswer(isMistake);
  };

  /**
   * Event handler for viewing dictionary
   */
  const handleView = () => {
    if (hints !== 0) {
      setHints((prevHints) => prevHints - 1);
      setIsViewing(true);
      setIsActive(false);
      setTimerRunning(false);
    }
  };

  /**
   * Event handler for closing dictionary
   */
  const handleViewClose = () => {
    setIsViewing(false);
    setIsActive(true);
    setTimerRunning(true);
  };

  /**
   * Event handler for game over
   */
  const handleGameOver = () => {
    setIsGameOver(true);
    setTimerRunning(false);
  };

  /**
   * Event handler for new game
   */
  const handleNewGame = () => {
    setIsActive(true);
    setIsGameOver(false);
    setScore(DEFAULT_SCORE);
    setLives(DEFAULT_LIVES);
    setHints(DEFAULT_HINTS);
    setTimeLeft(DEFAULT_TIME);
    setTimerRunning(true);
    setHighScore(() => {
      return parseInt(localStorage.getItem("highScore") as string) || 0;
    });
    setDictionary([]);
    seenWords.current = new Set();
  };

  /**
   * Event handler for returning to home
   */
  const handleReturnHome = () => {
    setIsActive(false);
    setIsGameOver(false);
    setIsViewing(false);
  };

  /**
   * Event handler for creating a new ranking for leaderboard
   */
  const handleNewRanking = async () => {
    if (!rankName || rankName === "") {
      alert("Plase enter a name!");
      return;
    }

    try {
      await fetch("http://localhost:5000/games/leaderboard/memorydictionary", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: rankName,
          score: score,
          timeCreated: Date.now(),
        }),
      });
      setNewRanking(false);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Sets the new highscore dynamically when score changes
   */
  useEffect(() => {
    if (score > highScore) {
      localStorage.setItem("highScore", score.toString());
    }
  }, [score]);

  /**
   * Timer for the game
   */
  useEffect(() => {
    if (!timerRunning) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Insures only one interval is running at any given time
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
          setIsActive(true);
          setIsGameOver(true);
          setTimerRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [timerRunning]);

  useEffect(() => {
    // Ensures the fetch is only ran when game is finished
    if (!isGameOver) return;

    const getLeaderboard = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/games/leaderboard/memorydictionary",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          },
        );

        const data = await res.json();
        if (!data || data.some((entry: entry) => entry.score < score)) {
          setNewRanking(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getLeaderboard();
  }, [isGameOver]);

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
        {/* Render for non active game */}
        {!isActive && !isViewing && !isGameOver && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
            }}
          >
            <Typography variant="h3" textAlign={"center"}>
              Memory Dictionary
            </Typography>
            <Box
              sx={{
                display: "flex",
                margin: "0 auto",
                gap: "10px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "150px",
                  margin: "0 auto",
                }}
                onClick={handleNewGame}
              >
                Start Game
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/leaderboard/memorydictionary")}
                disabled
              >
                View Leaderboard
              </Button>
            </Box>
          </Box>
        )}

        {/* Render for active game */}
        {isActive && !isGameOver && (
          <Box>
            <Box
              sx={{
                margin: "10px",
                display: "flex",
                flexDirection: isSmall ? "column" : "row",
                gap: isSmall ? "0px" : "40px",
                textAlign: isSmall ? "center" : "left",
              }}
            >
              <Typography variant="h6">Score: {score}</Typography>
              <Typography variant="h6">Lives: {lives}</Typography>
              <Typography variant="h6">Views Remaining: {hints}</Typography>
              <Typography variant="h6">Time Left: {timeLeft}</Typography>
            </Box>

            <Box sx={{ margin: "50px" }}>
              <Typography variant="h3" textAlign={"center"}>
                {currWord}
              </Typography>
            </Box>

            {/* Interact buttons */}
            <Box
              sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  gap: isSmall ? "45px" : "0px",
                }}
              >
                <Button variant="contained" onClick={handleAdd}>
                  Add
                </Button>
                <Button variant="contained" onClick={handleSeen}>
                  Seen
                </Button>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleView}
                  sx={{ maxWidth: "260px", width: "100%" }}
                  disabled={hints <= 0}
                >
                  View Dictionary
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Render for hint state */}
        {!isActive && isViewing && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
            }}
          >
            <Typography variant="h6" textAlign={"center"}>
              Time Left: {timeLeft}
            </Typography>
            <Box
              sx={{
                width: "300px",
                height: "300px",
                border: "1px solid black",
                textAlign: "center",
                overflowY: "auto",
                backgroundColor: "rgb(255, 255, 255)",
              }}
            >
              <Grid container spacing={2}>
                {dictionary.map((item, index) => (
                  <Grid size={4}>
                    <Typography variant="h6" key={index}>
                      {item}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Button
              variant="contained"
              sx={{ margin: "0 auto" }}
              onClick={handleViewClose}
            >
              Close
            </Button>
          </Box>
        )}

        {/* Render for Game Over */}
        {isActive && isGameOver && (
          <Box
            sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
          >
            <Typography variant="h3" textAlign={"center"}>
              Game Over!
            </Typography>
            <Typography variant="h5" textAlign={"center"}>
              {score > highScore
                ? `New High score: ${score}`
                : `Score: ${score}`}
            </Typography>

            {/* Adding to leaderboard (backend) */}
            {newRanking && (
              <Box>
                <Typography variant="h5">
                  You made it to the leaderboard!
                </Typography>
                <TextField
                  variant="outlined"
                  onChange={(event) => setRankName(event.target.value)}
                >
                  Enter Name
                </TextField>
                <Button variant="contained" onClick={handleNewRanking}>
                  Submit
                </Button>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button variant="contained" onClick={handleNewGame}>
                New Game
              </Button>
              <Button variant="contained" onClick={handleReturnHome}>
                Return to Home
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
