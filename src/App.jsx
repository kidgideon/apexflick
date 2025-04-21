import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import GamePlay from "./pages/gameplay/gameplay";
import HomePage from "./pages/homepage/homepage";
import Leaderboard from "./pages/leaderboard/leaderboard";

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/register" element={<Register/>} /> 
        <Route path="/Login" element={<Login/>} />   
        <Route path="/gameplay" element={<GamePlay/>} />
        <Route path="/" element={<HomePage/>} />   
        <Route path="/leaderboard" element={<Leaderboard/>} /> 
        </Routes>
    </Router>
  );
}

export default App;
