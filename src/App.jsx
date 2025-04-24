import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import GamePlay from "./pages/gameplay";
import HomePage from "./pages/homepage";
import Leaderboard from "./pages/leaderboard";
import Withdrawal from "./pages/withdrawal";
import Task from "./pages/task";
import AboutPage from "./pages/about";
import PrivacyPolicy from "./pages/privacyPolicy";
import TermsAndConditions from "./pages/tandc";
import Friends from "./pages/friends";
import SignupOnme from "./pages/signupOnMe";
import Notification from "./pages/notification";
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
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/privacy policy" element={<PrivacyPolicy/>}/>
        <Route path="/terms and conditions" element={<TermsAndConditions/>}/>
        <Route path="/friends" element={<Friends/>}/>
        <Route path="/signup/onme/:userId" element={<SignupOnme/>}/>
        <Route path="/notifications" element={<Notification/>}/>
        </Routes>
    </Router>
  );
}

export default App;
