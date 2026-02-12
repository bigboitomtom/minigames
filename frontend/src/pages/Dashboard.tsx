import { Navbar } from "../components/Navbar";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GridViewIcon from "@mui/icons-material/GridView";
import { useNavigate } from "react-router-dom";

const games: string[] = ["Memory Dictionary", "Sliding Tiles"];
const links: string[] = ["/game/memorydictionary", "/game/slidingtiles"];
const descriptions: string[] = [
  "Add as many short term memory words in the dictionary as possible.",
  "Move tiles within a set grid to complete the image.",
];

const iconStyle = {
  width: "100px",
  height: "100px",
  color: "rgb(149, 195, 231)",
};
const icons = [
  <AutoStoriesIcon sx={iconStyle} />,
  <GridViewIcon sx={iconStyle} />,
];

export function Dashboard() {
  const navigate = useNavigate();

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
        <Typography variant="h3" textAlign={"center"} m="40px">
          Pick a game to start!
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "50px",
          }}
        >
          {/* Cards */}
          {games.map((game, index) => (
            <Card key={game} sx={{ maxWidth: 250 }}>
              <CardActionArea onClick={() => navigate(links[index])}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  {icons[index]}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" textAlign={"center"}>
                    {game}
                  </Typography>
                  <Typography
                    variant="body2"
                    textAlign={"center"}
                    sx={{ color: "text.secondary" }}
                  >
                    {descriptions[index]}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
