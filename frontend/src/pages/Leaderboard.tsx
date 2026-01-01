// import { useParams } from "react-router-dom";

import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";

type entry = {
  name: string;
  score: number;
  timeCreated: Date;
};

export function Leaderboard() {
  // const gameType = useParams();
  const [rankings, setRankings] = useState<Array<entry>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getLeaderboard = async () => {
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
      setRankings(data);
      setLoading(false);
    };

    getLeaderboard();
  }, []);

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
        {loading && <Typography variant="h5">Loading Leaderboard...</Typography>}
        {!loading && (
          <Box>
            <Typography variant="h4">Memory Dictionary Leaderboard</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Rank</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Row</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rankings.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">{item.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
}
