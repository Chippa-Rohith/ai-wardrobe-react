// src/components/ItemCard.jsx
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  return (
    <div className="item-card">
      <img src={item.imageUrl} alt={item.attributes.articleType} className="item-image" />
      <div className="item-details">
        <h3>{item.attributes.articleType}</h3>
        <p>{item.attributes.gender}</p>
        <p>{item.attributes.season}</p>
        <Link to={`/edit-item/${item.id}`} className="edit-button">
          Edit
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
