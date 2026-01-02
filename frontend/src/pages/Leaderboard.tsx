import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";

type entry = {
  name: string;
  score: number;
  timeCreated: Date;
};

export function Leaderboard() {
  const [rankings, setRankings] = useState<Array<entry>>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
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
      if (!data) setIsEmpty(true);
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
        {loading && (
          <Typography variant="h5">Loading Leaderboard...</Typography>
        )}
        {!loading && (
          <Box>
            <Typography variant="h4">Memory Dictionary Leaderboard</Typography>
            {!isEmpty ? (
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
            ) : <Typography variant="h6">Leaderboard Empty</Typography>}
          </Box>
        )}
      </Box>
    </Box>
  );
}
