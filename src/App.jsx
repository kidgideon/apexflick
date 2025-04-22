import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import GamePlay from "./pages/gameplay";
import HomePage from "./pages/homepage";
import Leaderboard from "./pages/leaderboard";
import Withdrawal from "./pages/withdrawal";
import Task from "./pages/task";
function App() {
  return (
    <Router>
        <Routes>
        <Route path="/register" element={<Register/>} /> 
        <Route path="/Login" element={<Login/>} />   
        <Route path="/gameplay" element={<GamePlay/>} />
        <Route path="/" element={<HomePage/>} />   
        <Route path="/leaderboard" element={<Leaderboard/>} /> 
        <Route path="/withdraw" element={<Withdrawal/>}/>
        <Route path="/task" element={<Task/>}/>
        </Routes>
    </Router>
  );
}

export default App;
