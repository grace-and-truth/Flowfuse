import React from 'react';

const BookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21L3 17V7L12 3L21 7V17L12 21Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7L12 3V21M21 7L12 3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7V17M12 21V3" />
  </svg>
);

export default BookIcon;