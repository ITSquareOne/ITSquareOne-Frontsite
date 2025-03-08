import React from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void; // Add onLogout prop to handle the logout
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-black text-center">
        <h2 className="text-xl font-semibold">คุณต้องการออกจากระบบใช่หรือไม่?</h2>
        <div className="mt-4 flex justify-center gap-8">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            ใช่
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            ไม่
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
