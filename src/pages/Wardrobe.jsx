import { useEffect, useState } from "react";
import axios from "../api";
import "../styles/Wardrobe.css";


const Wardrobe = () => {
  const [items, setItems] = useState([]);
  console.log(import.meta.env.VITE_SAS_TOKEN)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/wardrobe");
        setItems(response.data.wardrobe);
      } catch (error) {
        console.error("Error fetching wardrobe items:", error);
      }
    };

    fetchItems();
  }, []);

  // Function to append SAS Token to the image URL
  const getImageUrl = (baseUrl) => {
    return `${baseUrl}?${import.meta.env.VITE_SAS_TOKEN}`;
  };

  return (
    <div className="wardrobe-container">
      <div className="wardrobe-header">
        <h2>Your Wardrobe</h2>
        <select>
          <option>Sort by: Popular</option>
          <option>Sort by: Price</option>
          <option>Sort by: Latest</option>
        </select>
      </div>

      <div className="wardrobe-grid">
        {items.map((item) => (
          <div key={item.id} className="wardrobe-card">
            {/* Image */}
            <img
              src={getImageUrl(item.imageUrl)}
              alt={item.articleType}
              className="wardrobe-image"
            />

            {/* Item Details */}
            <div className="card-details">
              <h3>{item.articleType || "Unknown Item"}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
