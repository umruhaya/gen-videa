import React from 'react';

interface ProfileImageUploaderProps {
  onImageChange: (file: File) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ onImageChange }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="profile-image">Profile Image</label>
      <input type="file" id="profile-image" onChange={handleImageChange} />
    </div>
  );
};

export default ProfileImageUploader;
