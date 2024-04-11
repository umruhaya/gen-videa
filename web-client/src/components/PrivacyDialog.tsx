// PrivacyDialog.tsx
import React from 'react';

// Define props for the PrivacyDialog component
interface PrivacyDialogProps {
    isOpen: boolean; // Determines if the dialog should be shown
    onClose: () => void; // Function to be called when the dialog is requested to close
    file: { uuid: string }; // Object representing the file, including its unique identifier
    onVisibilityChange: (fileId: string, isPublic: boolean) => void; // Function to change the visibility of the file
  }
  
// The PrivacyDialog functional component
  export default function PrivacyDialog({ isOpen, onClose, file, onVisibilityChange }: PrivacyDialogProps) {
    // If the dialog isn't open or there's no file provided, render nothing
    if (!isOpen || !file) return null;
  
  // The dialog's markup, shown when `isOpen` is true and a file is provided
  return (
    // Overlay for the dialog, making it modal and adding a dark translucent background
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10">
      {/* Center the dialog in the screen */}
      <div className="flex items-center justify-center h-full">
        {/* Dialog box */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Change Privacy Setting</h3>
          <p className="mt-2 text-sm text-gray-500">
            Choose if you want this image to be public or private.
          </p>
          <div className="mt-4">
            {/* Buttons to make the file public or private */}
            <button
              onClick={() => onVisibilityChange(file.uuid, true)}
              className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Make Public
            </button>
            <button
              onClick={() => onVisibilityChange(file.uuid, false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Make Private
            </button>
          </div>
          {/* Button to close the dialog */}
          <button
            onClick={onClose}
            className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
