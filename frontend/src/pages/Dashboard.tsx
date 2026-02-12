
import { Navbar } from "../components/Navbar";
import { Box, Typography } from "@mui/material";

export function Dashboard() {
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
        <Typography variant="h3" textAlign={"center"}>Click a game on the navbar to start!</Typography>
      </Box>
    </Box>
  );
}
