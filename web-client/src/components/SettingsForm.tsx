import React from 'react';
import ProfileImageUploader from './ProfileImageUploader';
import UsernameInput from './UsernameInput';
import ProfileNameInput from './ProfileNameInput';
import '../styles/Settings.css'; //


const SettingsForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the form submission
  };

  const handleProfileNameChange = (name: string) => {
    // Handle profile name change
    
  };

  const handleUsernameChange = (username: string) => {
    // Handle username change
  };

  const handleImageChange = (imageFile: File) => {
    // Handle image file change
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProfileImageUploader onImageChange={handleImageChange} />
      <UsernameInput onUsernameChange={handleUsernameChange} />
      <ProfileNameInput onProfileNameChange={handleProfileNameChange} />
      <button type="submit">Save</button>
    </form>
  );
};

export default SettingsForm;
