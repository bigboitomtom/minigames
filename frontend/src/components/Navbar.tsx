import { Box, Button, Typography } from "@mui/material";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100px",
        position: "absolute",
        backgroundColor: "#808080",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          p: "20px",
        }}
      >
        <img src={logo} style={{ width: "50px", height: "65px" }} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#787878",
            color: "#fff",
            border: "1px solid #fff",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <Typography variant="body1">Dashboard</Typography>
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#787878",
            color: "#fff",
            border: "1px solid #fff",
          }}
          onClick={() => navigate("/game/memorydictionary")}
        >
          <Typography variant="body1">Memory Dictionary</Typography>
        </Button>
        
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#787878",
            color: "#fff",
            border: "1px solid #fff",
          }}
          onClick={() => navigate("/game/slidingtiles")}
        >
          <Typography variant="body1">Sliding Tiles</Typography>
        </Button>
      </Box>
    </Box>
  );
}
