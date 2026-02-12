import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo.png";
import { useState } from "react";

const pages = ["Dashboard", "Memory Dictionary", "Sliding Tiles"];
const links = ["/dashboard", "/game/memorydictionary", "/game/slidingtiles"];

export function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const isSmall = useMediaQuery("(max-width:500px)");

  // Menu handlers
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (index: number) => {
    handleClose();
    navigate(links[index]);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", gap: "20px", width: "100%" }}
        >
          {/* Logo img */}
          <img src={logo} style={{ width: "35px", height: "50px" }} />

          {/* Nav buttons */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "flex" },
              justifyContent: isSmall ? "flex-end" : "row",
              gap: "20px",
            }}
          >
            {!isSmall &&
              pages.map((page, index) => (
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

            {isSmall && (
              <Box>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                  sx={{
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "transparent",
                      transform: "scale(1.10)",
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>

                {/* Menu dropdown */}
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {pages.map((page, index) => (
                    <MenuItem
                      key={page}
                      onClick={() => handlePageChange(index)}
                    >
                      {page}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
