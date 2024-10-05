// src/components/ImageProcessor.js
import React, { useState } from 'react';

function ImageProcessor() {
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:5000/process-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {imageSrc && <img src={imageSrc} alt="Processed" />}
    </div>
  );
}

export default ImageProcessor;
