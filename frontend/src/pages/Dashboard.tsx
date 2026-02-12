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
import GridViewIcon from '@mui/icons-material/GridView';

const games = ["Memory Dictionary", "Sliding Tiles"];
const links = ["/game/memorydictionary", "/game/slidingtiles"];
const descriptions = [];
const icons = [<AutoStoriesIcon />, ]

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
          Pick a game to start!
        </Typography>
        
        <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "50px"}}>

          <Card sx={{ maxWidth: 250 }}>
            <CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px"
                }}
              >
                <AutoStoriesIcon sx={{ width: "100px", height: "100px", color: "rgb(149, 195, 231)" }} />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" textAlign={"center"}>
                  Memory Dictionary
                </Typography>
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  sx={{ color: "text.secondary" }}
                >
                  Add as many short term memory words in the dictionary as
                  possible.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card sx={{ maxWidth: 250 }}>
            <CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px"
                }}
              >
                <GridViewIcon sx={{ width: "100px", height: "100px", color: "rgb(149, 195, 231)" }} />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" textAlign={"center"}>
                  Sliding Tiles
                </Typography>
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  sx={{ color: "text.secondary" }}
                >
                  Move tiles within a set grid to complete the image.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
