import React, { useState } from 'react';

interface ProfileNameInputProps {
  onProfileNameChange: (profileName: string) => void;
}

const ProfileNameInput: React.FC<ProfileNameInputProps> = ({ onProfileNameChange }) => {
  const [profileName, setProfileName] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProfileName = event.target.value;
    setProfileName(newProfileName);
    onProfileNameChange(newProfileName);
  };

  return (
    <div className="form-group">
      <label htmlFor="profile-name">Profile Name</label>
      <input
        type="text"
        id="profile-name"
        value={profileName}
        onChange={handleChange}
      />
    </div>
  );
};

export default ProfileNameInput;
