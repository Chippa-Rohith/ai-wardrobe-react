// src/components/AttributeEditor.jsx


const AttributeEditor = ({ attributes, onAttributeChange }) => {
  return (
    <div className="attribute-editor">
      {Object.keys(attributes).map((key) => (
        <div key={key} className="attribute-field">
          <label htmlFor={key}>{key}:</label>
          <input
            type="text"
            id={key}
            value={attributes[key]}
            onChange={(e) => onAttributeChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default AttributeEditor;
