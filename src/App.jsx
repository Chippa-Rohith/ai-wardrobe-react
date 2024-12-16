// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddItem from "./pages/AddItem";
import Wardrobe from "./pages/Wardrobe";
import EditItem from "./pages/EditItem";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app-container" style={{marginLeft:'180px'}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/edit-item/:id" element={<EditItem />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

