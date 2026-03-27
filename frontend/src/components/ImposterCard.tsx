import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { useMediaQuery } from "@mui/material";

type ImposterCardProps = {
  item: string | undefined;
  playerNum: number | undefined;
  onOpen: () => void;
};

export function ImposterCard({ item, playerNum, onOpen }: ImposterCardProps) {
  const [showWord, setShowWord] = useState<boolean>(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSmall = useMediaQuery("(max-width:500px)");

  const startHold = () => {
    onOpen();
    timeoutIdRef.current = setTimeout(() => {
      setShowWord(true);
    }, 1);
  };

  const stopHold = () => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    setShowWord(false);
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
          width: isSmall ? "200px" : "275px",
          height: isSmall ? "275px" : "350px",
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
          <Typography variant="h6" sx={{
            color: item ? "#008000" : "#FF0000"
          }}>
            {!item ? "You are the imposter" : item}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
