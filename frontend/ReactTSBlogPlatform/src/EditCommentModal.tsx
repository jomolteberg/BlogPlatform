// EditCommentModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

interface EditCommentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  commentText: string;
  onSave: (newText: string) => void;
}

Modal.setAppElement('#root'); // Endre dette til ditt app-element

export const EditCommentModal: React.FC<EditCommentModalProps> = ({ isOpen, onRequestClose, commentText, onSave }) => {
  const [text, setText] = useState(commentText);

  useEffect(() => {
    setText(commentText);
  }, [commentText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(text);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)' // Legger til en mørkere bakgrunn
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '50%', // Gjør modalen bredere
          minHeight: '30%', // Minimumshøyde
          padding: '20px', // Mer indre padding
          borderRadius: '10px', // Avrundede hjørner
          border: '1px solid #ccc', // Ramme rundt modalen
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Skyggeeffekt for dybde
        },
      }}
      contentLabel="Edit Comment"
    >
      <form onSubmit={handleSubmit}>
      <label htmlFor="commentText" className="hidden">Edit Comment</label>
      <textarea
      id="commentText"
  value={text}
  onChange={(e) => setText(e.target.value)}
  className="w-full h-32 p-2 border rounded" // Eksempel Tailwind CSS-klasser
></textarea>

        <button 
        type="submit"
        className='inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
        >Save</button>
        <button 
        type="button"
         onClick={onRequestClose}
         className='mt-2 mx-2 inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'

         >Cancel</button>
      </form>
    </Modal>
  );
};
