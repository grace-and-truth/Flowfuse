import React from 'react';

const UnderlineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25h15M6.75 4.5v9.75a5.25 5.25 0 0010.5 0V4.5" />
    </svg>
);

export default UnderlineIcon;
