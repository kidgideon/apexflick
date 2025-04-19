import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import GamePlay from "./pages/gameplay/gameplay";

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/register" element={<Register/>} /> 
        <Route path="/Login" element={<Login/>} />   
        <Route path="/gameplay" element={<GamePlay/>} />     
        </Routes>
    </Router>
  );
}

export default App;
