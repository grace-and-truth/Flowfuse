import React, { useRef, useEffect } from 'react';
import { EmailBlock } from '../../../../types';

interface TextBlockProps {
    block: EmailBlock;
    onUpdate: (block: EmailBlock) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ block, onUpdate }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const handleContentChange = () => {
        if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;
            if (newContent !== block.props.content) {
                onUpdate({ ...block, props: { ...block.props, content: newContent } });
            }
        }
    };
    
    // Set initial content without causing re-render loops
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== block.props.content) {
            editorRef.current.innerHTML = block.props.content || '';
        }
    }, [block.props.content]);

    return (
        <div
            style={{ 
                padding: `${block.props.paddingY || 0}px ${block.props.paddingX || 0}px`,
                textAlign: block.props.textAlign || 'left',
                fontFamily: block.props.fontFamily || 'Arial, sans-serif'
            }}
             className="text-slate-800"
        >
            <div
                ref={editorRef}
                contentEditable
                onBlur={handleContentChange}
                suppressContentEditableWarning={true}
                className="w-full focus:outline-none focus:ring-2 focus:ring-sky-300 p-2 rounded"
            />
        </div>
    );
};

export default TextBlock;