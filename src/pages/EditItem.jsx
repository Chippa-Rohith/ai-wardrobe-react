// src/pages/EditItem.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";

const EditItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const response = await axios.get(`/wardrobe/${id}`);
      setItem(response.data);
    };
    fetchItem();
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`/wardrobe/${id}`, item);
      alert("Item updated successfully.");
    } catch (err) {
      alert("Error saving item.");
    }
  };

  return (
    <div className="edit-item">
      {item ? (
        <div>
          <h2>Edit Item</h2>
          {Object.keys(item.attributes).map((attr) => (
            <div key={attr}>
              <label>{attr}:</label>
              <input
                type="text"
                value={item.attributes[attr]}
                onChange={(e) =>
                  setItem({ ...item, attributes: { ...item.attributes, [attr]: e.target.value } })
                }
              />
            </div>
          ))}
          <button onClick={handleSave}>Save Changes</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditItem;
