import React, { useState } from 'react';
import '../styles/UploadPage.css'; // Make sure the path is correct

interface UploadPageProps {
  // You can define props if needed
}

const UploadPage: React.FC<UploadPageProps> = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Submit logic here
    console.log('Image and caption submitted:', selectedImage, caption);
  };

  return (
    <div className="upload-page-container">
      <div className="upload-form-container">
        {selectedImage && (
          <div className="image-preview-container">
            <img className="image-preview" src={selectedImage} alt="Preview" />
          </div>
        )}
        <form className="upload-form" onSubmit={handleSubmit}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="file-input"
          />
          <textarea 
            className="caption-input" 
            placeholder="Type your caption..." 
            value={caption} 
            // onChange={handleCaptionChange}
          />
          <button className="submit-button" type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
