import React from 'react';

const Logo = ({ size = 32, className = "", animate = true }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animate ? 'animate-pulse' : ''}`}
      style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))' }}
    >
      {/* Outer Hexagonal Shield */}
      <path 
        d="M50 5L89.5 27.5V72.5L50 95L10.5 72.5V27.5L50 5Z" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinejoin="round" 
        className="text-sentinel-indigo opacity-30"
      />
      
      {/* Stylized 'S' Vector Path */}
      <path 
        d="M35 30H65V45H35V60H65" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-sentinel-indigo"
      />
      
      {/* Core Anomaly Beacon (The Emerald Eye) */}
      <circle 
        cx="50" 
        cy="50" 
        r="6" 
        fill="currentColor" 
        className="text-sentinel-emerald"
      />
      
      {/* Accent Corner Brackets */}
      <path d="M15 35V25H25" stroke="currentColor" strokeWidth="2" className="text-sentinel-indigo opacity-50" />
      <path d="M85 65V75H75" stroke="currentColor" strokeWidth="2" className="text-sentinel-indigo opacity-50" />
    </svg>
  );
};

export default Logo;
