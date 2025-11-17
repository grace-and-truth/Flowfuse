import React from 'react';

const ListOrderedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6h12M8.25 12h12M8.25 18h12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h.008v.008H3.75V6.75zM3.75 12.75h.008v.008H3.75v-.008zM3.75 18.75h.008v.008H3.75v-.008z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6H3v.75m1.5 5.25H3v.75m1.5 5.25H3v.75" opacity={0} />
    </svg>
);

export default ListOrderedIcon;
