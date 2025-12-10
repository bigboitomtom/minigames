import { Navigate, Route, Routes } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import "./App.css";
import { MemoryDictionary } from "./pages/MemoryDictionary";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/game/memorydictionary" element={<MemoryDictionary />} />
    </Routes>
  )
}

export default App
