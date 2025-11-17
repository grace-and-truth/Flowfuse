import React from 'react';
import { EmailBlock } from '../../../../types';

interface HeaderBlockProps {
    block: EmailBlock;
    onUpdate: (block: EmailBlock) => void;
    isSelected: boolean;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({ block, onUpdate, isSelected }) => {
    return (
        <div style={{ padding: `${block.props.paddingY || 16}px ${block.props.paddingX || 24}px`, textAlign: block.props.textAlign || 'left' }}>
            <img src={block.props.logoSrc} alt={block.props.logoAlt} style={{ display: 'inline-block', maxWidth: '100%', height: 'auto' }}/>
        </div>
    );
};

export default HeaderBlock;
