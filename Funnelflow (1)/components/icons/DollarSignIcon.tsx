import React from 'react';

const DollarSignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H7M17 19H7M12 12a3 3 0 100-6 3 3 0 000 6zM12 12a3 3 0 110 6 3 3 0 010-6z" />
    </svg>
);

export default DollarSignIcon;