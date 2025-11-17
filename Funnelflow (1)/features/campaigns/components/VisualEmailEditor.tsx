import React, { useState } from 'react';
import { EmailBlock, Campaign, FormField } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import BlockPicker from './BlockPicker';
import StylePanel from './StylePanel';
import BlockWrapper from './BlockWrapper';
import TextBlock from './renderers/TextBlock';
import ImageBlock from './renderers/ImageBlock';
import ButtonBlock from './renderers/ButtonBlock';
import DividerBlock from './renderers/DividerBlock';
import SpacerBlock from './renderers/SpacerBlock';
import HeaderBlock from './renderers/HeaderBlock';
import ShapeBlock from './renderers/ShapeBlock';
import FormBlock from './renderers/FormBlock';
import InlineAddPlaceholder from './InlineAddPlaceholder';

interface VisualEmailEditorProps {
    blocks: EmailBlock[];
    onBlocksChange: (blocks: EmailBlock[]) => void;
    style: Campaign['style'];
    onStyleChange: (style: Campaign['style']) => void;
}

const VisualEmailEditor: React.FC<VisualEmailEditorProps> = ({ blocks, onBlocksChange, style, onStyleChange }) => {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    const handleAddBlock = (type: EmailBlock['type'], index?: number) => {
        const newBlock: EmailBlock = {
            id: uuidv4(),
            type,
            props: {},
        };
        // Add default props based on type
        switch (type) {
            case 'text':
                newBlock.props.content = '<p>This is a new text block. Click to edit!</p>';
                newBlock.props.paddingX = 24;
                newBlock.props.paddingY = 16;
                newBlock.props.fontFamily = 'Arial, sans-serif';
                break;
            case 'image':
                newBlock.props.src = 'https://via.placeholder.com/600x300/e2e8f0/64748b?text=Click+to+change+image';
                newBlock.props.alt = 'Placeholder image';
                break;
            case 'button':
                newBlock.props.text = 'Click Me';
                newBlock.props.href = '#';
                newBlock.props.backgroundColor = '#0ea5e9';
                newBlock.props.textColor = '#ffffff';
                newBlock.props.textAlign = 'center';
                break;
            case 'divider':
                newBlock.props.color = '#cbd5e1';
                newBlock.props.paddingY = 10;
                break;
            case 'spacer':
                newBlock.props.height = 20;
                break;
            case 'header':
                newBlock.props.logoSrc = 'https://via.placeholder.com/150x50/0ea5e9/FFFFFF?text=Your+Logo';
                newBlock.props.logoAlt = 'Company Logo';
                break;
            case 'shape':
                newBlock.props.shapeType = 'rectangle';
                newBlock.props.backgroundColor = '#e2e8f0';
                newBlock.props.width = 200;
                newBlock.props.height = 100;
                newBlock.props.rotation = 0;
                newBlock.props.shapeText = 'Text';
                newBlock.props.shapeTextColor = '#1e293b';
                newBlock.props.shapeFontSize = 16;
                newBlock.props.fontFamily = 'Arial, sans-serif';
                break;
            case 'form':
                newBlock.props.formFields = [
                    { id: uuidv4(), type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
                    { id: uuidv4(), type: 'email', label: 'Email', placeholder: 'Enter your email address', required: true },
                ];
                newBlock.props.submitButtonText = 'Submit';
                newBlock.props.successMessage = 'Thank you for your submission!';
                newBlock.props.formStyle = 'simple';
                newBlock.props.paddingX = 24;
                newBlock.props.paddingY = 24;
                newBlock.props.formActionType = 'showMessage';
                newBlock.props.formActionData = {};
                break;
        }
        
        const newBlocks = [...blocks];
        if (index !== undefined) {
            newBlocks.splice(index, 0, newBlock);
        } else {
            newBlocks.push(newBlock);
        }

        onBlocksChange(newBlocks);
        setSelectedBlockId(newBlock.id);
    };
    
    const handleSelectBlock = (id: string | null) => {
        setSelectedBlockId(id);
    };

    const handleUpdateBlock = (updatedBlock: EmailBlock) => {
        onBlocksChange(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
    };
    
    const handleDeleteBlock = (id: string) => {
        onBlocksChange(blocks.filter(b => b.id !== id));
        if (selectedBlockId === id) {
            setSelectedBlockId(null);
        }
    };
    
    const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
        const index = blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= blocks.length) return;
        
        const newBlocks = [...blocks];
        const [movedBlock] = newBlocks.splice(index, 1);
        newBlocks.splice(newIndex, 0, movedBlock);
        onBlocksChange(newBlocks);
    };

    const handleMoveBlockLayer = (id: string, direction: 'forward' | 'backward') => {
        handleMoveBlock(id, direction === 'forward' ? 'down' : 'up');
    };

    const handleDuplicateBlock = (id: string) => {
        const blockToDuplicate = blocks.find(b => b.id === id);
        if (!blockToDuplicate) return;
        const index = blocks.findIndex(b => b.id === id);
        
        const newBlock = {
            ...blockToDuplicate,
            id: uuidv4(),
            // Deep copy props that have their own IDs, like form fields
            props: {
                ...blockToDuplicate.props,
                formFields: blockToDuplicate.props.formFields?.map(f => ({ ...f, id: uuidv4() }))
            }
        };

        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        onBlocksChange(newBlocks);
        setSelectedBlockId(newBlock.id);
    }

    const selectedBlock = blocks.find(b => b.id === selectedBlockId);
    const selectedBlockIndex = blocks.findIndex(b => b.id === selectedBlockId);

    const renderBlock = (block: EmailBlock) => {
        const props = {
            key: block.id,
            block,
            onUpdate: handleUpdateBlock,
            isSelected: selectedBlockId === block.id,
        };
        switch (block.type) {
            case 'text': return <TextBlock {...props} />;
            case 'image': return <ImageBlock {...props} />;
            case 'button': return <ButtonBlock {...props} />;
            case 'divider': return <DividerBlock {...props} />;
            case 'spacer': return <SpacerBlock {...props} />;
            case 'header': return <HeaderBlock {...props} />;
            case 'shape': return <ShapeBlock {...props} />;
            case 'form': return <FormBlock {...props} />;
            default: return null;
        }
    };

    return (
        <div className="flex-1 flex bg-slate-800 overflow-hidden">
            <BlockPicker onAddBlock={handleAddBlock} />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar" style={{ backgroundColor: style?.bodyBackgroundColor || '#f1f5f9' }}>
                <div 
                    className="max-w-2xl mx-auto shadow-lg" 
                    style={{ backgroundColor: style?.contentBackgroundColor || '#ffffff' }}
                    onClick={() => handleSelectBlock(null)}
                >
                    <InlineAddPlaceholder onAdd={(type) => handleAddBlock(type, 0)} isVisible={blocks.length > 0} />
                    {blocks.map((block, index) => (
                       <div key={block.id} className="relative">
                            <BlockWrapper 
                                block={block}
                                isSelected={selectedBlockId === block.id}
                                onSelect={handleSelectBlock}
                                onDelete={handleDeleteBlock}
                                onMove={handleMoveBlock}
                                onDuplicate={handleDuplicateBlock}
                            >
                                {renderBlock(block)}
                            </BlockWrapper>
                            <InlineAddPlaceholder onAdd={(type) => handleAddBlock(type, index + 1)} isVisible={true} />
                        </div>
                    ))}
                    {blocks.length === 0 && (
                        <div className="text-center p-12">
                             <InlineAddPlaceholder onAdd={(type) => handleAddBlock(type, 0)} isVisible={true} forceShow={true} />
                             <p className="text-slate-500 mt-4">Add your first block to build your email.</p>
                        </div>
                    )}
                </div>
            </div>
            <StylePanel
                selectedBlock={selectedBlock}
                onUpdateBlock={handleUpdateBlock}
                globalStyle={style}
                onUpdateGlobalStyle={onStyleChange}
                onClose={() => handleSelectBlock(null)}
                onMoveLayer={handleMoveBlockLayer}
                isFirstBlock={selectedBlockIndex === 0}
                isLastBlock={selectedBlockIndex === blocks.length - 1}
            />
        </div>
    );
};

export default VisualEmailEditor;