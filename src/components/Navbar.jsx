import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Import the new styles

const Navbar = () => {
  return (
    <aside className="navbar">
      <h1>AI Wardrobe</h1>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/add-item">Add Item</Link>
        <Link to="/wardrobe">Wardrobe</Link>
      </nav>
    </aside>
  );
};

export default Navbar;

