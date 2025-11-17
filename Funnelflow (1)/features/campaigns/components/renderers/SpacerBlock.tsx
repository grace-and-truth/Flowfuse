import React from 'react';
import { EmailBlock } from '../../../../types';

interface SpacerBlockProps {
    block: EmailBlock;
}

const SpacerBlock: React.FC<SpacerBlockProps> = ({ block }) => {
    return (
        <div 
            style={{ 
                height: `${block.props.height || 20}px`,
                lineHeight: `${block.props.height || 20}px`,
                fontSize: `${block.props.height || 20}px`
            }}
        >
            &nbsp;
        </div>
    );
};

export default SpacerBlock;
