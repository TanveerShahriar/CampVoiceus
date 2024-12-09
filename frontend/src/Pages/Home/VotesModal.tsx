import React from 'react';

interface ModalProps {
    isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const VotesModal: React.FC<ModalProps> = ({ isOpenState }) => {
  const [isOpen, setIsOpen] = isOpenState;

  const handleCloseModal = () => {
        setIsOpen(false);
    };

  return (
    <div 
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',   // This will blur the background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }}
        // Optional: close if user clicks outside the modal container
        onClick={handleCloseModal}
        >
        <div 
            style={{
            width: '75vw',    // 75% of viewport width
            maxWidth: '900px',
            background: '#fff',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            position: 'relative',
            }}
            // Stop click event from bubbling up to the parent overlay
            onClick={(e) => e.stopPropagation()}
        >
            <h2>Modal Title</h2>
            <p>This is some info inside the modal. It occupies about 75% of the screen width.</p>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            Close
            </button>
        </div>
    </div>
  );
};

export default VotesModal;
