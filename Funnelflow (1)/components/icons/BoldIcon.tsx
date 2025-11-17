import React from 'react';

const BoldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.25c-3.036 0-5.25 1.8-5.25 4.5s2.214 4.5 5.25 4.5h.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 14.25c3.036 0 5.25 2.025 5.25 4.5s-2.214 4.5-5.25 4.5h-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 9.75V4.5a.75.75 0 01.75-.75h4.5a4.5 4.5 0 010 9h-4.5a.75.75 0 01-.75-.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 18.75v-4.5a.75.75 0 01.75-.75h6a4.5 4.5 0 010 9h-6a.75.75 0 01-.75-.75z" />
    </svg>
);

export default BoldIcon;
