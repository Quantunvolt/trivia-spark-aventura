import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  show: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center transform transition-all animate-slide-in-up max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-display text-slate-700 mb-4">{title}</h2>
        <div className="font-body text-slate-600">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;