import { Navigate, Route, Routes } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import "./App.css";
import { MemoryDictionary } from "./pages/MemoryDictionary";
import { Leaderboard } from "./pages/Leaderboard";
import { SlidingTiles } from "./pages/SlidingTiles";
import { Imposter } from "./pages/Imposter";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/game/memorydictionary" element={<MemoryDictionary />} />
      <Route path="/game/slidingtiles" element={<SlidingTiles />} />
      <Route path="/game/imposter" element={<Imposter />} />
      <Route path="/leaderboard/:game" element={<Leaderboard />} />
    </Routes>
  )
} 

export default App
