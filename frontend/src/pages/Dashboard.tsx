import { Navbar } from "../components/Navbar";
import { Box, Typography, useMediaQuery } from "@mui/material";

export function Dashboard() {
  const isSmall = useMediaQuery("(max-width: 500px)");
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
        <Typography variant="h3" textAlign={"center"}>
          {isSmall
            ? "Click a game from the menu icon to start!"
            : "Click a game on the navbar to start!"}
        </Typography>
      </Box>
    </Box>
  );
}
