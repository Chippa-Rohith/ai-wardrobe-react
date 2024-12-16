import { useState } from "react";
import axios from "../api";
import "../styles/AddItem.css";

const AddItem = () => {
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(""); // Image URL after upload
  const [predictions, setPredictions] = useState(null); // Predicted attributes

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/attributePredict", formData);
      setUploadedImage(response.data.imageUrl);
      setPredictions(response.data.predictions);
    } catch (err) {
      alert("Error uploading item.");
    }
  };

   // Function to append SAS Token to the image URL
  const getImageUrl = (baseUrl) => {
    return `${baseUrl}?${import.meta.env.VITE_SAS_TOKEN}`;
  };

  return (
    <div className="add-item-container">
      <h2>Add a New Item</h2>
      <form onSubmit={handleUpload} className="upload-form">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Upload</button>
      </form>

      {/* Display Uploaded Image */}
      {uploadedImage && (
        <div className="uploaded-image">
          <h3>Uploaded Image</h3>
          <img src={getImageUrl(uploadedImage)} alt="Uploaded Item" />
        </div>
      )}

      {/* Popup for Predicted Attributes */}
      {predictions && (
        <div className="predictions-popup">
          <div className="popup-content">
            <h3>Predicted Attributes</h3>
            <ul>
              <li><strong>Gender:</strong> {predictions.gender}</li>
              <li><strong>Master Category:</strong> {predictions.masterCategory}</li>
              <li><strong>Sub Category:</strong> {predictions.subCategory}</li>
              <li><strong>Article Type:</strong> {predictions.articleType}</li>
              <li><strong>Season:</strong> {predictions.season}</li>
              <li><strong>Usage:</strong> {predictions.usage}</li>
            </ul>
            <button onClick={() => setPredictions(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddItem;
