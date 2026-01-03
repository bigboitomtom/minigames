import { Box, Button, Typography } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import img1 from "../assets/shrek1.png";
import img2 from "../assets/shrek2.png";
import img3 from "../assets/shrek3.png";
import img4 from "../assets/shrek4.png";
import img5 from "../assets/shrek5.png";
import img6 from "../assets/shrek6.png";
import img7 from "../assets/shrek7.png";
import img8 from "../assets/shrek8.png";

const shuffleArray = (arr: string[]): string[][] => {
  let currIndex: number = arr.length;
  let randIndex: number;

  while (currIndex !== 0) {
    randIndex = Math.floor(Math.random() * currIndex);
    currIndex--;

    [arr[currIndex], arr[randIndex]] = [arr[randIndex], arr[currIndex]];
  }

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
  const [displayImgs, setDisplayImgs] = useState<string[][]>([]);

  const handleNewGame = () => {
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
    setDisplayImgs(shuffleArray(imgs));
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
        )}
      </Box>
    </Box>
  );
}
