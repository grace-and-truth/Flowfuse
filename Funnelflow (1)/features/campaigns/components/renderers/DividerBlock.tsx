import React from 'react';
import { EmailBlock } from '../../../../types';

interface DividerBlockProps {
    block: EmailBlock;
}

const DividerBlock: React.FC<DividerBlockProps> = ({ block }) => {
    return (
        <div style={{ padding: `${block.props.paddingY || 0}px ${block.props.paddingX || 0}px` }}>
            <hr 
                style={{ 
                    border: 'none', 
                    borderTop: `1px solid ${block.props.color || '#cbd5e1'}`,
                    margin: 0
                }}
            />
        </div>
    );
};

export default DividerBlock;
