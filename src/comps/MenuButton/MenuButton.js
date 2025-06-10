import React from 'react';

const MenuButton = ({ onClick, children, style = {} }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        padding: '12px 18px',
        fontSize: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        ...style
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        e.target.style.transform = 'scale(1)';
      }}
    >
      {children || '🏠 Menu'}
    </button>
  );
};

export default MenuButton;