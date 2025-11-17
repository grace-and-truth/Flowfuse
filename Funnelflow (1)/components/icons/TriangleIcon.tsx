import React from 'react';

const TriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 22h20L12 2z" fill="currentColor" stroke="none"/>
    </svg>
);

export default TriangleIcon;