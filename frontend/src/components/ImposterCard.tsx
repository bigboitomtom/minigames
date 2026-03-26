import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useRef, useState } from "react";

type ImposterCardProps = {
  item: string | undefined;
  playerNum: number | undefined;
  onOpen: () => void;
};

export function ImposterCard({ item, playerNum, onOpen }: ImposterCardProps) {
  const [showWord, setShowWord] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHold = () => {
    setIsHolding(true);
    onOpen();
    timeoutIdRef.current = setTimeout(() => {
      setShowWord(true);
      console.log("you are holding");
    }, 1);
  };

  const stopHold = () => {
    setIsHolding(false);
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    setShowWord(false);
    console.log("you stopped holding");
  };

  return (
    <Card
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
    >
      <CardContent
        sx={{
          width: "275px",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Player {playerNum}
        </Typography>
        {!showWord && (
          <Typography variant="h6">
          Hold to Reveal
        </Typography>
        )}
        {showWord && (
          <Typography variant="h5" sx={{
            color: item ? "#008000" : "#FF0000"
          }}>
            {!item ? "You are the imposter" : item}
          </Typography>
        )}
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}
