import React from 'react';

interface ModalProps {
    isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const VotesModal: React.FC<ModalProps> = ({ isOpenState }) => {
  const [isOpen, setIsOpen] = isOpenState;

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleCloseModal}
    >
      <div
        className="w-3/4 max-w-[900px] bg-white rounded-lg p-4 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">Modal Title</h2>
        <p className="mt-2 text-gray-600">
          This is some info inside the modal. It occupies about 75% of the screen width.
        </p>
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200 text-3xl font-bold"
          aria-label="Close"
        >
          &times; {/* Unicode for '×' symbol */}
        </button>
      </div>
    </div>
  );
};

export default VotesModal;