import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Container,
} from "@mui/material";
import logo from "../assets/logo.png";

export function Navbar() {
  const pages = ["Dashboard", "Memory Dictionary", "Sliding Tiles"];
  const links = ["/dashboard", "/game/memorydictionary", "/game/slidingtiles"];

  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", gap: "20px" }}>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            ></IconButton>
          </Box>

          {/* Logo img */}
          <img src={logo} style={{ width: "35px", height: "50px" }} />

          {/* Nav buttons */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: "20px",
            }}
          >
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={() => navigate(links[index])}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgb(25, 118, 211)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
