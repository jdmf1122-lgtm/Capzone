import React from 'react';

interface PesoIconProps {
  className?: string;
}

export const PesoIcon: React.FC<PesoIconProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Philippine Peso"
    >
      {/* P Stem & Curve */}
      <path d="M7 21V4h7a5 5 0 0 1 0 10H7" />
      {/* Upper Crossbar */}
      <line x1="5" y1="7" x2="16" y2="7" />
      {/* Lower Crossbar */}
      <line x1="5" y1="11" x2="16" y2="11" />
    </svg>
  );
};
