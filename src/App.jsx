import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/register/register";

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/register" element={<Register/>} />     
        </Routes>
    </Router>
  );
}

export default App;
