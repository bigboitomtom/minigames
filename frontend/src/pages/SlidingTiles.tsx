import { Box, Button, Typography } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import img1 from "../assets/shrek1.png";
import img2 from "../assets/shrek2.png";
import img3 from "../assets/shrek3.png";
import img4 from "../assets/shrek4.png";
import img5 from "../assets/shrek5.png";
import img6 from "../assets/shrek6.png";
import img7 from "../assets/shrek7.png";
import img8 from "../assets/shrek8.png";

const imgs: string[] = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  null as any,
];

const solved: string[][] = [
  [img1, img4, img7], [img2, img5, img8], [img3, img6, null as any]
]


// Some shuffles arent solvable
const shuffleBoard = (arr: string[]): string[][] => {
  let currIndex: number = arr.length;
  let randIndex: number;

  while (currIndex !== 0) {
    randIndex = Math.floor(Math.random() * currIndex);
    currIndex--;

    [arr[currIndex], arr[randIndex]] = [arr[randIndex], arr[currIndex]];
  }

  const inversions = countInversions(arr);
  // Odd inversions is considered solvable, due to array display structure
  if (inversions % 2 === 0) {
    // If not solvable on first shuffle, force a solvable puzzle
    console.log("not solvable");
    const temp = arr[8];
    arr[8] = arr[5];
    arr[5] = temp;
    console.log("final arr:", arr);
  }

  const newArr: string[][] = convert1dTo2d(arr);
  return newArr;
};

const countInversions = (arr: string[]) => {
  // Remove blank tile
  const regex = /\d+/;
  const tiles = arr.filter((x) => x !== null);
  const tileNumbers = tiles.map((x) => {
    const match = x.match(regex) as RegExpMatchArray;
    if (!match) {
      throw new Error(`invalid tile: ${x}`);
    }
    // Converts into number
    return Number(match[0]);
  })
  
  
  console.log(arr);
  console.log(tileNumbers);
  
  // Count inversions
  // Odd inversions is considered solvable, due to array display structure
  let inversions = 0;
  for (let i = 0; i < tileNumbers.length; i++) {
    for (let j = i + 1; j < tileNumbers.length; j++) {
      if (tileNumbers[i] > tileNumbers[j]) {
        inversions++;
      }
    }
  }
  console.log(inversions);
  return inversions;
}

const convert1dTo2d = (arr: string[]): string[][] => {
  const newArr: string[][] = [];
  for (let i = 0; i < arr.length; i += 3) {
    const subArr: string[] = [arr[i], arr[i + 1], arr[i + 2]];
    newArr.push(subArr);
  }
  return newArr;
}

const findNullPos = (arr: string[][]) => {
  let nullPos = null;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[i][j] === null) {
        nullPos = { i, j };
        break;
      }
    }
    if (nullPos) break;
  }
  return nullPos as { i: number; j: number };
};

// Finds adjacent images from the empty square
const findAdjImgs = (arr: string[][]): string[] => {
  const nullPos = findNullPos(arr);

  if (!nullPos) return [];

  const { i, j } = nullPos;
  const adjImgs = [];

  // Left of nullPos
  if (i > 0) adjImgs.push(arr[i - 1][j]);
  // Right of nullPos
  if (i < arr.length - 1) adjImgs.push(arr[i + 1][j]);
  // Top of nullPos
  if (j > 0) adjImgs.push(arr[i][j - 1]);
  // Bottom of nullPos
  if (j < arr.length - 1) adjImgs.push(arr[i][j + 1]);

  return adjImgs;
};

export function SlidingTiles() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [displayImgs, setDisplayImgs] = useState<string[][]>([]);
  const [timeRunning, setTimeRunning] = useState<number>(-1);

  const handleNewGame = () => {
    setDisplayImgs(shuffleBoard(imgs));

    // Start the timer
    setTimeRunning(0);
    setIsActive(true);
  };

  const handleImgClick = (rowIndex: number, i: number): void => {
    const selectedImg = displayImgs[rowIndex][i];
    const adjImgs = findAdjImgs(displayImgs);
    if (adjImgs.includes(selectedImg)) {
      const nullPos = findNullPos(displayImgs);
      const newArr = [...displayImgs];

      // Swap positions
      newArr[nullPos.i][nullPos.j] = selectedImg;
      newArr[rowIndex][i] = null as any;
      setDisplayImgs(newArr);
    }
  };

  const handleReset = () => {
    setDisplayImgs(shuffleBoard(imgs));

    // Reset timer
    setTimeRunning(0);
  };

  // Timer for active game
  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(() => {
      setTimeRunning(timeRunning + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeRunning]);

  useEffect(() => {
    if (displayImgs === solved) {
      alert("Solved");
      setIsActive(false);
    }
  }, [displayImgs]);

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
        {!isActive && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h3" textAlign={"center"}>
              Sliding Tiles
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
              <Button variant="contained">View Leaderboard</Button>
            </Box>
          </Box>
        )}
        {isActive && (
          <Box>
            <Typography variant="h5">Time: {timeRunning}</Typography>
            <Button variant="contained" onClick={handleReset}>Reset</Button>
            <Box
              tabIndex={0}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 150px)",
                justifyContent: "center",
              }}
            >
              {displayImgs.map((row, rowIndex) => (
                <Box key={rowIndex}>
                  {row.map((item: string, i: number) => (
                    <Box
                      key={i}
                      sx={{
                        width: "150px",
                        height: "150px",
                        border: "1px solid black",
                        aspectRatio: "1 / 1",
                        margin: "0 auto",
                      }}
                      onClick={() => handleImgClick(rowIndex, i)}
                    >
                      <img src={item} />
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
