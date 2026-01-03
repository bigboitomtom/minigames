import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { generate } from "random-words";
import { useNavigate } from "react-router-dom";

const DEFAULT_SCORE = 0;
const DEFAULT_LIVES = 3;
const DEFAULT_HINTS = 5;
const DEFAULT_TIME = 10;

type entry = {
  name: string;
  score: number;
  timeCreated: Date;
};

const generateNewWord = (dictionary: string[]): string => {
  if (dictionary.length === 0) {
    return generate({ maxLength: 3 }) as string;
  }

  const prob = Math.random();
  const repeatIndex = Math.floor(Math.random() * (dictionary.length - 1));

  console.log("index", repeatIndex);

  if (dictionary.length <= 15 && prob <= 0.2) {
    return dictionary[repeatIndex];
  } else if (dictionary.length <= 25 && prob <= 0.3) {
    return dictionary[repeatIndex];
  } else if (dictionary.length <= 35 && prob <= 0.4) {
    return dictionary[repeatIndex];
  } else if (dictionary.length > 35 && prob <= 0.5) {
    return dictionary[repeatIndex];
  } else {
    return generate({ maxLength: 3 }) as string;
  }
};

export function MemoryDictionary() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [currWord, setCurrWord] = useState<string>(
    generate({ maxLength: 3 }) as string
  );
  const [score, setScore] = useState<number>(DEFAULT_SCORE);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("highScore") as string) || 0;
  });
  const [lives, setLives] = useState<number>(DEFAULT_LIVES);
  const [hints, setHints] = useState<number>(DEFAULT_HINTS);
  const [dictionary, setDictionary] = useState<string[]>([]);

  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  const [newRanking, setNewRanking] = useState<boolean>(false);
  const [rankName, setRankName] = useState<string>("");

  const seenWords = useRef<Set<string>>(new Set());

  const processAnswer = (isMistake: boolean): void => {
    if (isMistake) {
      const newLives = lives - 1;
      if (newLives === 0) {
        setIsGameOver(true);
      } else {
        setLives(newLives);
      }
    } else {
      setScore(score + 1);
    }

    if (!seenWords.current.has(currWord)) {
      setDictionary([...dictionary, currWord]);
      seenWords.current.add(currWord);
    }
    setCurrWord(generateNewWord(dictionary));
    setTimeLeft(DEFAULT_TIME);
  };

  const handleAdd = () => {
    const isMistake = dictionary.includes(currWord);
    processAnswer(isMistake);
  };

  const handleSeen = () => {
    const isMistake = !dictionary.includes(currWord);
    processAnswer(isMistake);
  };

  const handleView = () => {
    if (hints !== 0) {
      setHints(hints - 1);
      setIsViewing(true);
      setIsActive(false);
      setTimerRunning(false);
    }
  };

  const handleViewClose = () => {
    setIsViewing(false);
    setIsActive(true);
    setTimerRunning(true);
    // Add one second since view close takes one second
    setTimeLeft(timeLeft + 1);
  };

  const handleNewGame = () => {
    setIsActive(true);
    setIsGameOver(false);
    setScore(DEFAULT_SCORE);
    setLives(DEFAULT_LIVES);
    setHints(DEFAULT_HINTS);
    setTimeLeft(DEFAULT_TIME);
    setHighScore(() => {
      return parseInt(localStorage.getItem("highScore") as string) || 0;
    });
    setDictionary([]);
  };

  const handleReturnHome = () => {
    setIsActive(false);
    setIsGameOver(false);
  };

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

  // Sets the new highscore dynamically when score changes
  useEffect(() => {
    if (score > highScore) {
      localStorage.setItem("highScore", score.toString());
    }
  }, [score]);

  useEffect(() => {
    if (!timerRunning) return;
    // If timer reaches 0 stop
    if (timeLeft <= 0) {
      setIsActive(true);
      setIsGameOver(true);
      return;
    }

    // Runs one instance of setInterval which runs for one second
    const intervalId = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    // When a new setInterval is called the previous one is cleared
    return () => clearInterval(intervalId);
  }, [timeLeft]);

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
          }
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
            }}
          >
            <Typography variant="h3">Memory Dictionary</Typography>
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
              >
                View Leaderboard
              </Button>
            </Box>
          </Box>
        )}

        {/* Render for active game */}
        {isActive && !isGameOver && (
          <Box>
            <Typography variant="h5">{currWord}</Typography>
            <Typography variant="h6">Score: {score}</Typography>
            <Typography variant="h6">Lives: {lives}</Typography>
            <Typography variant="h6">Views Remaining: {hints}</Typography>
            <Typography variant="h6">Time Left: {timeLeft}</Typography>

            <Button variant="contained" onClick={handleAdd}>
              Add
            </Button>
            <Button variant="contained" onClick={handleSeen}>
              Seen
            </Button>
            <Button variant="contained" onClick={handleView}>
              View Dictionary
            </Button>
          </Box>
        )}

        {/* Render for hint state */}
        {!isActive && isViewing && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                width: "200px",
                height: "200px",
                border: "1px solid black",
                textAlign: "center",
                overflowY: "auto",
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
              sx={{ width: "20px", margin: "0 auto" }}
              onClick={handleViewClose}
            >
              Close
            </Button>
          </Box>
        )}

        {/* Render for Game Over */}
        {isActive && isGameOver && (
          <Box>
            <Typography variant="h3">Game Over!</Typography>
            <Typography variant="h5">
              {score > highScore
                ? `New High score: ${score}`
                : `Score: ${score}`}
            </Typography>
            {newRanking && (
              <Box>
                <Typography variant="h5">You made it to the leaderboard!</Typography>
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
            <Button variant="contained" onClick={handleNewGame}>
              New Game
            </Button>
            <Button variant="contained" onClick={handleReturnHome}>
              Return to Home
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
