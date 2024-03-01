import React, { useState } from 'react';

interface UsernameInputProps {
  onUsernameChange: (username: string) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ onUsernameChange }) => {
  const [username, setUsername] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    onUsernameChange(newUsername);
  };

  return (
    <div className="form-group">
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={handleChange}
      />
    </div>
  );
};

export default UsernameInput;
