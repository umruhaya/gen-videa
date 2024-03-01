
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setProfilePicture(file);

    if (file) {
      setProfilePictureUrl(URL.createObjectURL(file));
    } else {
      setProfilePictureUrl('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log({ name, username, profilePicture });
    alert('Profile updated! (Frontend only, no data sent)');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Your username"
          />
        </div>

        <div>
          <label htmlFor="profile-picture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            id="profile-picture"
            onChange={handleProfilePictureChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          {profilePictureUrl && (
            <img src={profilePictureUrl} alt="Profile preview" className="mt-4 h-20 w-20 object-cover rounded-full"/>
          )}
        </div>

        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
