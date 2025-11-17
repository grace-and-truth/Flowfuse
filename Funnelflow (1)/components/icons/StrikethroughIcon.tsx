import React from 'react';

const StrikethroughIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h19.5M9.75 4.5v15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.5c-3.314 0-6 2.686-6 6s2.686 6 6 6" />
    </svg>
);

export default StrikethroughIcon;
