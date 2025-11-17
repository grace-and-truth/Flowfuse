import React from 'react';

const ShapeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25h-8.25m8.25 0L18 14.25m-7.5-6l-1.5 1.5" />
        <circle cx="15.75" cy="15.75" r="3.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ShapeIcon;
