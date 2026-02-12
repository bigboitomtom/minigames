import { Box, Button, Modal, Typography, useMediaQuery } from "@mui/material";
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
import solvedImg from "../assets/solved.png";

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
  [img1, img4, img7],
  [img2, img5, img8],
  [img3, img6, null as any],
];

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
    const temp = arr[8];
    arr[8] = arr[5];
    arr[5] = temp;
  }

  // const test: string[][] = [
  //   [img1, img4, img7],
  //   [img2, img5, img8],
  //   [img3, null as any, img6],
  // ];
  // return test;
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
  });

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
  return inversions;
};

const convert1dTo2d = (arr: string[]): string[][] => {
  const newArr: string[][] = [];
  for (let i = 0; i < arr.length; i += 3) {
    const subArr: string[] = [arr[i], arr[i + 1], arr[i + 2]];
    newArr.push(subArr);
  }
  return newArr;
};

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
  const [isHelp, setIsHelp] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [displayImgs, setDisplayImgs] = useState<string[][]>([]);
  const [hoveredTile, setHoveredTile] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [timeRunning, setTimeRunning] = useState<number>(-1);

  const isSmall = useMediaQuery("(max-width:500px)");

  const handleImgClick = (rowIndex: number, i: number): void => {
    if (isGameOver) return;
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
    setIsGameOver(false);
    setIsActive(true);
  };

  const handleModalOpen = () => setIsHelp(true);
  const handleModalClose = () => setIsHelp(false);

  const handleReturnHome = () => {
    setIsActive(false);
  };

  // Timer for active game
  useEffect(() => {
    if (!isActive || isGameOver) return;

    const intervalId = setInterval(() => {
      setTimeRunning(timeRunning + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeRunning]);

  // Check for winning game
  useEffect(() => {
    if (!isActive) return;

    const isSolved = displayImgs.every((row, rowIndex) => {
      return row.every((cell, colIndex) => cell === solved[rowIndex][colIndex]);
    });
    if (isSolved) {
      setIsGameOver(true);
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
        {/* Render home screen */}
        {!isActive && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
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
                onClick={handleReset}
              >
                Start Game
              </Button>
              <Button variant="contained" disabled>
                View Leaderboard
              </Button>
            </Box>
          </Box>
        )}

        {/* Render active game */}
        {isActive && (
          <Box
            sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
          >
            {isGameOver && (
              <Typography variant="h5" textAlign={"center"}>
                Game Over
              </Typography>
            )}
            <Typography variant="h5" textAlign={"center"}>
              Time: {timeRunning}
            </Typography>
            {!isGameOver && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={handleReset}>
                  Reset
                </Button>
                <Button variant="contained" onClick={handleModalOpen}>
                  Help
                </Button>

                {/* Help Modal */}
                {isHelp && (
                  <Modal open={isHelp} onClose={handleModalClose}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: isSmall ? "275px" : "450px",
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <img
                        src={solvedImg}
                        style={{
                          width: isSmall ? "275px" : "450px",
                          height: isSmall ? "275px" : "450px",
                        }}
                      />
                    </Box>
                  </Modal>
                )}
              </Box>
            )}

            {/* Render for game over */}
            {isGameOver && (
              <Box
                sx={{ display: "flex", justifyContent: "center", gap: "10px" }}
              >
                <Button variant="contained" onClick={handleReset}>
                  New Game
                </Button>
                <Button variant="contained" onClick={handleReturnHome}>
                  Return To Home
                </Button>
              </Box>
            )}

            {/* Render for sliding tiles */}
            <Box
              tabIndex={0}
              sx={{
                display: "grid",
                gridTemplateColumns: isSmall
                  ? "repeat(3, 100px)"
                  : "repeat(3, 150px)",
                justifyContent: "center",
                border: "2px solid black",
              }}
            >
              {displayImgs.map((row, rowIndex) => (
                <Box key={rowIndex}>
                  {row.map((item: string, colIndex: number) => (
                    <Box
                      key={colIndex}
                      sx={{
                        width: isSmall ? "100px" : "150px",
                        height: isSmall ? "100px" : "150px",
                        aspectRatio: "1 / 1",
                        margin: "0 auto",
                      }}
                      onClick={() => handleImgClick(rowIndex, colIndex)}
                    >
                      {item && (
                        <img
                          src={item}
                          onMouseEnter={() =>
                            setHoveredTile({ row: rowIndex, col: colIndex })
                          }
                          onMouseLeave={() => setHoveredTile(null)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter:
                              hoveredTile?.row === rowIndex &&
                              hoveredTile?.col === colIndex
                                ? "brightness(70%)"
                                : "brightness(100%)",
                          }}
                        />
                      )}
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
