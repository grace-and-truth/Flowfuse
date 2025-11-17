import React from 'react';
import { EmailBlock } from '../../../types';
import TrashIcon from '../../../components/icons/TrashIcon';
import ChevronUpIcon from '../../../components/icons/ChevronUpIcon';
import ChevronDownIcon from '../../../components/icons/ChevronDownIcon';
import CopyIcon from '../../../components/icons/CopyIcon';
import MoveIcon from '../../../components/icons/MoveIcon';

interface BlockWrapperProps {
    children: React.ReactNode;
    block: EmailBlock;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onMove: (id: string, direction: 'up' | 'down') => void;
    onDuplicate: (id: string) => void;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ children, block, isSelected, onSelect, onDelete, onMove, onDuplicate }) => {

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }

    return (
        <div 
            className={`relative border-2 ${isSelected ? 'border-sky-500' : 'border-transparent hover:border-sky-500/30'}`}
            onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
        >
            {children}
            {isSelected && (
                <>
                    <div className="absolute top-1/2 -right-7 -translate-y-1/2 flex flex-col gap-1 bg-slate-700 p-1 rounded-md shadow-lg">
                        <button onClick={(e) => handleActionClick(e, () => onMove(block.id, 'up'))} className="p-1 text-slate-300 hover:bg-slate-600 hover:text-white rounded"><ChevronUpIcon className="w-4 h-4" /></button>
                        <button onClick={(e) => handleActionClick(e, () => onMove(block.id, 'down'))} className="p-1 text-slate-300 hover:bg-slate-600 hover:text-white rounded"><ChevronDownIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="absolute top-2 -left-8 flex items-center bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded capitalize">
                        {block.type}
                    </div>
                     <div className="absolute bottom-1 -right-7 flex flex-col gap-1 bg-slate-700 p-1 rounded-md shadow-lg">
                        <button onClick={(e) => handleActionClick(e, () => onDuplicate(block.id))} className="p-1 text-slate-300 hover:bg-slate-600 hover:text-white rounded"><CopyIcon className="w-4 h-4" /></button>
                        <button onClick={(e) => handleActionClick(e, () => onDelete(block.id))} className="p-1 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BlockWrapper;
