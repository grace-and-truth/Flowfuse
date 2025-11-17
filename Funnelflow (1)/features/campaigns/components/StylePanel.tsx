import React, { useState } from 'react';
import { EmailBlock, Campaign, FormField } from '../../../types';
import TriangleIcon from '../../../components/icons/TriangleIcon';
import StarIcon from '../../../components/icons/StarIcon';
import BringForwardIcon from '../../../components/icons/BringForwardIcon';
import SendBackwardIcon from '../../../components/icons/SendBackwardIcon';
import LinkInput from './LinkInput';
import BoldIcon from '../../../components/icons/BoldIcon';
import ItalicIcon from '../../../components/icons/ItalicIcon';
import UnderlineIcon from '../../../components/icons/UnderlineIcon';
import StrikethroughIcon from '../../../components/icons/StrikethroughIcon';
import ListOrderedIcon from '../../../components/icons/ListOrderedIcon';
import ListUnorderedIcon from '../../../components/icons/ListUnorderedIcon';
import LinkIcon from '../../../components/icons/LinkIcon';
import UnlinkIcon from '../../../components/icons/UnlinkIcon';
import TextColorIcon from '../../../components/icons/TextColorIcon';
import HighlightIcon from '../../../components/icons/HighlightIcon';
import LinkEditorModal from './LinkEditorModal';
import { v4 as uuidv4 } from 'uuid';
import TrashIcon from '../../../components/icons/TrashIcon';
import PlusIcon from '../../../components/icons/PlusIcon';

interface StylePanelProps {
    selectedBlock: EmailBlock | null | undefined;
    onUpdateBlock: (block: EmailBlock) => void;
    globalStyle: Campaign['style'];
    onUpdateGlobalStyle: (style: Campaign['style']) => void;
    onClose: () => void;
    onMoveLayer: (id: string, direction: 'forward' | 'backward') => void;
    isFirstBlock: boolean;
    isLastBlock: boolean;
}

const StyleInput: React.FC<{ label: string; children: React.ReactNode, className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <label className="text-xs font-medium text-slate-400 block mb-1">{label}</label>
        {children}
    </div>
);

const webSafeFonts = [
    { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Courier New', value: "'Courier New', Courier, monospace" },
    { label: 'Inter', value: 'Inter, sans-serif' },
];

const ShapeTypeButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`p-2 rounded-md ${active ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>{children}</button>
);

const FormattingButton: React.FC<{ onClick: () => void, children: React.ReactNode, title: string }> = ({ onClick, children, title }) => (
    <button
        title={title}
        onMouseDown={e => e.preventDefault()}
        onClick={onClick}
        className="p-2 rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white"
    >
        {children}
    </button>
);

const ColorPicker: React.FC<{ command: 'foreColor' | 'backColor', children: React.ReactNode, title: string }> = ({ command, children, title }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const execCmd = (val: string | null) => {
        if (val) document.execCommand(command, false, val);
    };
    return (
        <div className="relative">
            <FormattingButton title={title} onClick={() => inputRef.current?.click()}>
                {children}
            </FormattingButton>
            <input
                ref={inputRef}
                type="color"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onMouseDown={e => e.preventDefault()}
                onChange={e => execCmd(e.target.value)}
            />
        </div>
    );
};


const StylePanel: React.FC<StylePanelProps> = ({ selectedBlock, onUpdateBlock, globalStyle, onUpdateGlobalStyle, onClose, onMoveLayer, isFirstBlock, isLastBlock }) => {
    
    const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);
    const [linkEditorState, setLinkEditorState] = useState<{ text: string, url: string, range: Range | null }>({ text: '', url: '', range: null });

    if (!selectedBlock) {
        return (
             <aside className="w-72 bg-slate-900 border-l border-slate-700/50 p-4 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4">Global Styles</h3>
                <div className="space-y-4">
                    <StyleInput label="Body Background">
                        <input
                            type="color"
                            value={globalStyle?.bodyBackgroundColor || '#f1f5f9'}
                            onChange={(e) => onUpdateGlobalStyle({ ...globalStyle, bodyBackgroundColor: e.target.value })}
                            className="w-full h-8 p-0 border-none rounded bg-slate-700 cursor-pointer"
                        />
                    </StyleInput>
                    <StyleInput label="Content Background">
                        <input
                            type="color"
                            value={globalStyle?.contentBackgroundColor || '#ffffff'}
                            onChange={(e) => onUpdateGlobalStyle({ ...globalStyle, contentBackgroundColor: e.target.value })}
                            className="w-full h-8 p-0 border-none rounded bg-slate-700 cursor-pointer"
                        />
                    </StyleInput>
                </div>
                 <div className="mt-auto text-center text-sm text-slate-500">
                    Select a block to edit its properties.
                </div>
            </aside>
        );
    }
    
    const handlePropChange = (prop: string, value: any) => {
        onUpdateBlock({ ...selectedBlock, props: { ...selectedBlock.props, [prop]: value } });
    };

    const handleDimensionChange = (prop: 'width' | 'height', value: string) => {
        const numValue = parseInt(value, 10);
        if (selectedBlock.props.shapeType === 'circle' || selectedBlock.props.shapeType === 'star') {
             onUpdateBlock({ ...selectedBlock, props: { ...selectedBlock.props, width: numValue, height: numValue } });
        } else {
            handlePropChange(prop, numValue);
        }
    }
    
    const execCmd = (cmd: string, val: any = null) => {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand(cmd, false, val);
    };

    const handleLink = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        let text = selection.toString();
        let url = '';

        let parentElement = range.startContainer.parentElement;
        while (parentElement && parentElement.tagName !== 'A' && parentElement.isContentEditable) {
            parentElement = parentElement.parentElement;
        }

        if (parentElement && parentElement.tagName === 'A') {
            const linkElement = parentElement as HTMLAnchorElement;
            url = linkElement.getAttribute('href') || '';
            if (text.length === 0) {
                text = linkElement.innerText;
                range.selectNodeContents(linkElement);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        
        setLinkEditorState({ text, url, range });
        setIsLinkEditorOpen(true);
    };

    const handleSaveLink = ({ text, url }: { text: string; url: string }) => {
        const { range } = linkEditorState;
        if (range) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);

            range.deleteContents();

            if (text && url) {
                const link = document.createElement('a');
                link.href = url;
                link.textContent = text;
                link.target = '_blank';
                range.insertNode(link);
            } else if (text) {
                const textNode = document.createTextNode(text);
                range.insertNode(textNode);
            }
        }
        setIsLinkEditorOpen(false);
        // The onBlur event on the TextBlock will handle the update.
    };

    const handleFormFieldsChange = (updatedFields: FormField[]) => {
        handlePropChange('formFields', updatedFields);
    };
    
    const renderTextFormatting = () => (
        <>
            <h4 className="font-semibold text-slate-300 text-sm mb-2">Text Formatting</h4>
            <div className="grid grid-cols-5 gap-2 mb-2">
                <FormattingButton title="Bold" onClick={() => execCmd('bold')}><BoldIcon className="w-4 h-4" /></FormattingButton>
                <FormattingButton title="Italic" onClick={() => execCmd('italic')}><ItalicIcon className="w-4 h-4" /></FormattingButton>
                <FormattingButton title="Underline" onClick={() => execCmd('underline')}><UnderlineIcon className="w-4 h-4" /></FormattingButton>
                <FormattingButton title="Strikethrough" onClick={() => execCmd('strikeThrough')}><StrikethroughIcon className="w-4 h-4" /></FormattingButton>
                <ColorPicker title="Text Color" command="foreColor"><TextColorIcon className="w-4 h-4" /></ColorPicker>
                <FormattingButton title="Unordered List" onClick={() => execCmd('insertUnorderedList')}><ListUnorderedIcon className="w-4 h-4" /></FormattingButton>
                <FormattingButton title="Ordered List" onClick={() => execCmd('insertOrderedList')}><ListOrderedIcon className="w-4 h-4" /></FormattingButton>
                <FormattingButton title="Add/Edit Link" onClick={handleLink}><LinkIcon className="w-4 h-4" /></FormattingButton>
                <FormattingButton title="Remove Link" onClick={() => execCmd('unlink')}><UnlinkIcon className="w-4 h-4" /></FormattingButton>
                <ColorPicker title="Highlight Color" command="backColor"><HighlightIcon className="w-4 h-4" /></ColorPicker>
            </div>
        </>
    );

    const renderBlockStyles = () => {
        switch (selectedBlock.type) {
            case 'text':
                return (
                    <>
                        {renderTextFormatting()}
                        <hr className="border-slate-700 my-4" />
                        <h4 className="font-semibold text-slate-300 text-sm mb-2">Block Styles</h4>
                        <StyleInput label="Alignment">
                            <select
                                value={selectedBlock.props.textAlign || 'left'}
                                onChange={(e) => handlePropChange('textAlign', e.target.value)}
                                className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </StyleInput>
                         <StyleInput label="Font Family">
                            <select
                                value={selectedBlock.props.fontFamily || 'Arial, sans-serif'}
                                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                                className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                            >
                                {webSafeFonts.map(font => (
                                    <option key={font.value} value={font.value} style={{fontFamily: font.value}}>
                                        {font.label}
                                    </option>
                                ))}
                            </select>
                        </StyleInput>
                    </>
                );
            case 'button':
            case 'header':
                 return (
                    <StyleInput label="Alignment">
                        <select
                            value={selectedBlock.props.textAlign || 'left'}
                            onChange={(e) => handlePropChange('textAlign', e.target.value)}
                            className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                        >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </StyleInput>
                );
            default: return null;
        }
    };
    
    const renderSpecificStyles = () => {
        switch (selectedBlock.type) {
            case 'header':
                return (
                    <>
                        <StyleInput label="Logo URL">
                            <input type="text" value={selectedBlock.props.logoSrc || ''} onChange={(e) => handlePropChange('logoSrc', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                        </StyleInput>
                        <StyleInput label="Alt Text">
                            <input type="text" value={selectedBlock.props.logoAlt || ''} onChange={(e) => handlePropChange('logoAlt', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                        </StyleInput>
                    </>
                );
            case 'image':
                return (
                    <>
                        <StyleInput label="Image URL">
                            <input type="text" value={selectedBlock.props.src || ''} onChange={(e) => handlePropChange('src', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                        </StyleInput>
                        <StyleInput label="Alt Text">
                            <input type="text" value={selectedBlock.props.alt || ''} onChange={(e) => handlePropChange('alt', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                        </StyleInput>
                        <hr className="border-slate-700 my-2" />
                        <StyleInput label="Link">
                            <LinkInput href={selectedBlock.props.href} onHrefChange={(href) => handlePropChange('href', href)} />
                        </StyleInput>
                    </>
                )
            case 'button':
                return (
                    <>
                        <StyleInput label="Button Text">
                             <input type="text" value={selectedBlock.props.text || ''} onChange={(e) => handlePropChange('text', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                        </StyleInput>
                        <StyleInput label="Link">
                            <LinkInput href={selectedBlock.props.href} onHrefChange={(href) => handlePropChange('href', href)} />
                        </StyleInput>
                        <StyleInput label="Background Color">
                            <input type="color" value={selectedBlock.props.backgroundColor || '#0ea5e9'} onChange={(e) => handlePropChange('backgroundColor', e.target.value)} className="w-full h-8 p-0 border-none rounded bg-slate-700 cursor-pointer"/>
                        </StyleInput>
                        <StyleInput label="Text Color">
                            <input type="color" value={selectedBlock.props.textColor || '#ffffff'} onChange={(e) => handlePropChange('textColor', e.target.value)} className="w-full h-8 p-0 border-none rounded bg-slate-700 cursor-pointer"/>
                        </StyleInput>
                    </>
                )
             case 'spacer':
                return (
                    <StyleInput label="Height (px)">
                        <input type="number" value={selectedBlock.props.height || 20} min="1" onChange={(e) => handlePropChange('height', parseInt(e.target.value))} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                    </StyleInput>
                )
             case 'divider':
                 return (
                    <StyleInput label="Color">
                        <input type="color" value={selectedBlock.props.color || '#cbd5e1'} onChange={(e) => handlePropChange('color', e.target.value)} className="w-full h-8 p-0 border-none rounded bg-slate-700 cursor-pointer"/>
                    </StyleInput>
                )
            case 'shape':
                const isSymmetrical = selectedBlock.props.shapeType === 'circle' || selectedBlock.props.shapeType === 'star';
                return (
                     <>
                        <StyleInput label="Shape">
                             <div className="grid grid-cols-5 gap-2">
                                <ShapeTypeButton active={selectedBlock.props.shapeType === 'rectangle'} onClick={() => handlePropChange('shapeType', 'rectangle')}>
                                    <div className="w-4 h-4 bg-current"></div>
                                </ShapeTypeButton>
                                <ShapeTypeButton active={selectedBlock.props.shapeType === 'circle'} onClick={() => handlePropChange('shapeType', 'circle')}>
                                    <div className="w-4 h-4 bg-current rounded-full"></div>
                                </ShapeTypeButton>
                                <ShapeTypeButton active={selectedBlock.props.shapeType === 'triangle-up'} onClick={() => handlePropChange('shapeType', 'triangle-up')}>
                                    <TriangleIcon className="w-4 h-4"/>
                                </ShapeTypeButton>
                                 <ShapeTypeButton active={selectedBlock.props.shapeType === 'triangle-down'} onClick={() => handlePropChange('shapeType', 'triangle-down')}>
                                    <TriangleIcon className="w-4 h-4 transform rotate-180"/>
                                </ShapeTypeButton>
                                <ShapeTypeButton active={selectedBlock.props.shapeType === 'star'} onClick={() => handlePropChange('shapeType', 'star')}>
                                    <StarIcon className="w-4 h-4"/>
                                </ShapeTypeButton>
                            </div>
                        </StyleInput>
                        <StyleInput label="Color">
                            <input type="color" value={selectedBlock.props.backgroundColor || '#e2e8f0'} onChange={(e) => handlePropChange('backgroundColor', e.target.value)} className="w-full h-8 p-0 border-none rounded bg-slate-700 cursor-pointer"/>
                        </StyleInput>
                        <div className={`grid ${isSymmetrical ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                            <StyleInput label={isSymmetrical ? "Size (px)" : "Width (px)"}>
                                <input type="number" value={selectedBlock.props.width || 100} min="10" max="600" onChange={(e) => handleDimensionChange('width', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                            </StyleInput>
                            {!isSymmetrical && (
                                <StyleInput label="Height (px)">
                                    <input type="number" value={selectedBlock.props.height || 50} min="10" max="600" onChange={(e) => handleDimensionChange('height', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                                </StyleInput>
                            )}
                        </div>
                         <StyleInput label={`Rotation (${selectedBlock.props.rotation || 0}°)`}>
                             <input type="range" min="0" max="360" value={selectedBlock.props.rotation || 0} onChange={(e) => handlePropChange('rotation', parseInt(e.target.value))} className="w-full"/>
                         </StyleInput>
                         <hr className="border-slate-700 my-2" />
                         <h4 className="font-semibold text-slate-300 text-sm mb-2">Text Overlay</h4>
                         <StyleInput label="Text Content">
                            <textarea value={selectedBlock.props.shapeText || ''} onChange={(e) => handlePropChange('shapeText', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none h-20 text-sm"/>
                         </StyleInput>
                         <div className="grid grid-cols-2 gap-2">
                             <StyleInput label="Text Color">
                                <input type="color" value={selectedBlock.props.shapeTextColor || '#1e293b'} onChange={(e) => handlePropChange('shapeTextColor', e.target.value)} className="w-full h-8 p-0 border-none rounded bg-slate-700 cursor-pointer"/>
                            </StyleInput>
                             <StyleInput label="Font Size">
                                <input type="number" value={selectedBlock.props.shapeFontSize || 16} min="8" onChange={(e) => handlePropChange('shapeFontSize', parseInt(e.target.value))} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                            </StyleInput>
                         </div>
                         <StyleInput label="Font Family">
                            <select
                                value={selectedBlock.props.fontFamily || 'Arial, sans-serif'}
                                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                                className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                            >
                                {webSafeFonts.map(font => (
                                    <option key={font.value} value={font.value} style={{fontFamily: font.value}}>
                                        {font.label}
                                    </option>
                                ))}
                            </select>
                        </StyleInput>
                    </>
                );
            case 'form':
                const fields = selectedBlock.props.formFields || [];
                
                const updateField = (id: string, prop: keyof FormField, value: any) => {
                    const updatedFields = fields.map(f => f.id === id ? { ...f, [prop]: value } : f);
                    handleFormFieldsChange(updatedFields);
                };

                const addField = () => {
                    const newField: FormField = { id: uuidv4(), type: 'text', label: 'New Field', required: false };
                    handleFormFieldsChange([...fields, newField]);
                };

                const deleteField = (id: string) => {
                    handleFormFieldsChange(fields.filter(f => f.id !== id));
                };

                return (
                    <>
                         <StyleInput label="Form Style">
                            <select
                                value={selectedBlock.props.formStyle || 'simple'}
                                onChange={(e) => handlePropChange('formStyle', e.target.value)}
                                className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                            >
                                <option value="simple">Simple</option>
                                <option value="modern">Modern</option>
                            </select>
                        </StyleInput>
                        <StyleInput label="Submit Button Text">
                            <input type="text" value={selectedBlock.props.submitButtonText || ''} onChange={(e) => handlePropChange('submitButtonText', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                        </StyleInput>
                        <hr className="border-slate-700 my-4" />
                        <h4 className="font-semibold text-slate-300 text-sm mb-2">Form Fields</h4>
                        <div className="space-y-3">
                            {fields.map(field => (
                                <div key={field.id} className="bg-slate-800 p-3 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-white">{field.label || "Field"}</p>
                                        <button onClick={() => deleteField(field.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                    <input type="text" value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)} placeholder="Label" className="w-full p-1.5 bg-slate-700 rounded-md text-white text-sm focus:outline-none"/>
                                    <input type="text" value={field.placeholder || ''} onChange={e => updateField(field.id, 'placeholder', e.target.value)} placeholder="Placeholder" className="w-full p-1.5 bg-slate-700 rounded-md text-white text-sm focus:outline-none"/>
                                    <div className="flex items-center gap-2">
                                        <select value={field.type} onChange={e => updateField(field.id, 'type', e.target.value)} className="flex-1 p-1.5 bg-slate-700 rounded-md text-white text-sm focus:outline-none">
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="textarea">Text Area</option>
                                            <option value="checkbox">Checkbox</option>
                                        </select>
                                        <label className="flex items-center gap-1.5 text-sm text-slate-300">
                                            <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, 'required', e.target.checked)} className="bg-slate-600 border-slate-500 rounded text-sky-500 focus:ring-sky-500"/>
                                            Required
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addField} className="mt-3 w-full flex items-center justify-center text-sm p-2 bg-slate-700 rounded-md text-sky-400 hover:bg-slate-600">
                           <PlusIcon className="w-4 h-4 mr-2" /> Add Field
                        </button>
                        <hr className="border-slate-700 my-4" />
                        <h4 className="font-semibold text-slate-300 text-sm mb-2">Submission Action</h4>
                        <StyleInput label="Action Type">
                            <select
                                value={selectedBlock.props.formActionType || 'showMessage'}
                                onChange={(e) => {
                                    const newType = e.target.value as NonNullable<EmailBlock['props']['formActionType']>;
                                    onUpdateBlock({
                                        ...selectedBlock,
                                        props: {
                                            ...selectedBlock.props,
                                            formActionType: newType,
                                            formActionData: {}, // Reset data on type change
                                        }
                                    });
                                }}
                                className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                            >
                                <option value="showMessage">Show Message</option>
                                <option value="redirect">Redirect to URL</option>
                                <option value="nextStep">Go to Next Funnel Step</option>
                                <option value="addTags">Add Tags to Contact</option>
                            </select>
                        </StyleInput>

                        {selectedBlock.props.formActionType === 'showMessage' && (
                            <StyleInput label="Success Message">
                                <textarea value={selectedBlock.props.successMessage || ''} onChange={(e) => handlePropChange('successMessage', e.target.value)} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none h-20 text-sm"/>
                            </StyleInput>
                        )}

                        {selectedBlock.props.formActionType === 'redirect' && (
                            <StyleInput label="Redirect URL">
                                <input
                                    type="url"
                                    value={selectedBlock.props.formActionData?.redirectUrl || ''}
                                    onChange={(e) => handlePropChange('formActionData', { ...selectedBlock.props.formActionData, redirectUrl: e.target.value })}
                                    placeholder="https://example.com/thank-you"
                                    className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                                />
                            </StyleInput>
                        )}

                        {selectedBlock.props.formActionType === 'addTags' && (
                            <StyleInput label="Tags to Add">
                                <input
                                    type="text"
                                    value={selectedBlock.props.formActionData?.tags || ''}
                                    onChange={(e) => handlePropChange('formActionData', { ...selectedBlock.props.formActionData, tags: e.target.value })}
                                    placeholder="lead, prospect, interested"
                                    className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">Comma-separated tags.</p>
                            </StyleInput>
                        )}

                        {selectedBlock.props.formActionType === 'nextStep' && (
                            <p className="text-sm text-slate-400 bg-slate-800 p-3 rounded-md">
                                After submission, the contact will be automatically advanced to the next step in this funnel.
                            </p>
                        )}
                    </>
                );
             default: return null;
        }
    };

    const renderPaddingStyles = () => {
        switch (selectedBlock.type) {
            case 'text':
            case 'divider':
            case 'header':
            case 'form':
                return (
                    <>
                     <hr className="border-slate-700 my-4" />
                     <h4 className="font-semibold text-slate-300 text-sm mb-2">Spacing</h4>
                     <StyleInput label="Vertical Padding (px)">
                        <input type="number" value={selectedBlock.props.paddingY || 0} min="0" onChange={(e) => handlePropChange('paddingY', parseInt(e.target.value))} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                     </StyleInput>
                      <StyleInput label="Horizontal Padding (px)">
                        <input type="number" value={selectedBlock.props.paddingX || 0} min="0" onChange={(e) => handlePropChange('paddingX', parseInt(e.target.value))} className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"/>
                     </StyleInput>
                    </>
                )
            default: return null;
        }
    }

    return (
        <>
            <aside className="w-72 bg-slate-900 border-l border-slate-700/50 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white capitalize">{selectedBlock.type} Properties</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                    {renderBlockStyles()}
                    {renderSpecificStyles()}
                    {renderPaddingStyles()}

                    <hr className="border-slate-700 my-4" />
                    
                    <StyleInput label="Arrange" className="space-y-2">
                        <button 
                            onClick={() => onMoveLayer(selectedBlock.id, 'forward')}
                            disabled={isLastBlock}
                            className="w-full flex items-center justify-center text-sm p-2 bg-slate-700 rounded-md text-white hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed">
                            <BringForwardIcon className="w-4 h-4 mr-2" />
                            Bring Forward
                        </button>
                        <button
                            onClick={() => onMoveLayer(selectedBlock.id, 'backward')}
                            disabled={isFirstBlock}
                            className="w-full flex items-center justify-center text-sm p-2 bg-slate-700 rounded-md text-white hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed">
                            <SendBackwardIcon className="w-4 h-4 mr-2" />
                            Send Backward
                        </button>
                    </StyleInput>

                </div>
            </aside>
            {isLinkEditorOpen && (
                <LinkEditorModal
                    isOpen={isLinkEditorOpen}
                    onClose={() => setIsLinkEditorOpen(false)}
                    onSave={handleSaveLink}
                    initialText={linkEditorState.text}
                    initialUrl={linkEditorState.url}
                />
            )}
        </>
    );
};

export default StylePanel;