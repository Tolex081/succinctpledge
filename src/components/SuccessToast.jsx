import React from 'react';

const SuccessToast = ({ message, show }) => {
  return (
    <div 
      className={`fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transform transition-transform duration-300 z-50 ${
        show ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {message}
    </div>
  );
};

export default SuccessToast;