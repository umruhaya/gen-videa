// PrivacyDialog.tsx
import React from 'react';
//hehehehehehehe
interface PrivacyDialogProps {
    isOpen: boolean;
    onClose: () => void;
    file: { uuid: string }; 
    onVisibilityChange: (fileId: string, isPublic: boolean) => void;
  }
  

  export default function PrivacyDialog({ isOpen, onClose, file, onVisibilityChange }: PrivacyDialogProps) {
    if (!isOpen || !file) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10">
      <div className="flex items-center justify-center h-full">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Change Privacy Setting</h3>
          <p className="mt-2 text-sm text-gray-500">
            Choose if you want this image to be public or private.
          </p>
          <div className="mt-4">
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
