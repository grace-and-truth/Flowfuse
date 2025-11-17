import React from 'react';
import { EmailBlock } from '../../../../types';

interface ImageBlockProps {
    block: EmailBlock;
    onUpdate: (block: EmailBlock) => void;
    isSelected: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, onUpdate, isSelected }) => {
    const imageTag = <img src={block.props.src} alt={block.props.alt} className="max-w-full h-auto block" />;
    
    return (
        <div className="p-0">
           {block.props.href ? (
                <a href={block.props.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', border: 0, display: 'block' }}>
                    {imageTag}
                </a>
           ) : (
                imageTag
           )}
        </div>
    );
};

export default ImageBlock;