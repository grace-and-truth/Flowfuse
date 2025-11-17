import React from 'react';

const TextColorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m-15 0l15 15" stroke="none"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 4.5l-3.344 9.362m0 0a4.5 4.5 0 106.126 5.894M6.406 13.862L3.75 21m16.5-12.898L18.638 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.638 3a4.5 4.5 0 01-6.28 6.28L3.75 21" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.638 3L21 8.25" />
    </svg>
);

export default TextColorIcon;
