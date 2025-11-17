import React from 'react';
import { EmailBlockType } from '../../../types';
import TextIcon from '../../../components/icons/TextIcon';
import ImageIcon from '../../../components/icons/ImageIcon';
import ButtonIcon from '../../../components/icons/ButtonIcon';
import DividerIcon from '../../../components/icons/DividerIcon';
import SpacerIcon from '../../../components/icons/SpacerIcon';
import HeaderIcon from '../../../components/icons/HeaderIcon';
import ShapeIcon from '../../../components/icons/ShapeIcon';
import FormIcon from '../../../components/icons/FormIcon';

interface BlockPickerProps {
    onAddBlock: (type: EmailBlockType) => void;
}

const blockTypes: { type: EmailBlockType, label: string, icon: React.ElementType }[] = [
    { type: 'header', label: 'Header', icon: HeaderIcon },
    { type: 'text', label: 'Text', icon: TextIcon },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'button', label: 'Button', icon: ButtonIcon },
    { type: 'form', label: 'Form', icon: FormIcon },
    { type: 'divider', label: 'Divider', icon: DividerIcon },
    { type: 'spacer', label: 'Spacer', icon: SpacerIcon },
    { type: 'shape', label: 'Shape', icon: ShapeIcon },
];

const BlockPickerButton: React.FC<{ label: string, icon: React.ReactNode, onClick: () => void }> = ({ label, icon, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex flex-col items-center p-3 my-1 rounded-lg transition-colors duration-200 text-slate-400 hover:bg-slate-700 hover:text-white"
    >
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
    </button>
);

const BlockPicker: React.FC<BlockPickerProps> = ({ onAddBlock }) => {
    return (
        <aside className="w-24 bg-slate-900 border-r border-slate-700/50 p-2 overflow-y-auto">
            <h3 className="text-xs font-semibold text-slate-500 uppercase text-center mb-2">Content</h3>
            {blockTypes.map(({ type, label, icon: Icon }) => (
                <BlockPickerButton
                    key={type}
                    label={label}
                    icon={<Icon className="w-6 h-6" />}
                    onClick={() => onAddBlock(type)}
                />
            ))}
        </aside>
    );
};

export default BlockPicker;