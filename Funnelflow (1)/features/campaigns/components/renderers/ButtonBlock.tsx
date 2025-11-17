import React from 'react';
import { EmailBlock } from '../../../../types';

interface ButtonBlockProps {
    block: EmailBlock;
    onUpdate: (block: EmailBlock) => void;
    isSelected: boolean;
}

const ButtonBlock: React.FC<ButtonBlockProps> = ({ block, onUpdate, isSelected }) => {
    return (
        <div style={{ padding: '16px 24px', textAlign: block.props.textAlign || 'center' }}>
            <a
                href={block.props.href || '#'}
                target="_blank"
                style={{
                    display: 'inline-block',
                    backgroundColor: block.props.backgroundColor || '#0ea5e9',
                    color: block.props.textColor || '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                }}
            >
                {block.props.text || 'Button Text'}
            </a>
        </div>
    );
};

export default ButtonBlock;