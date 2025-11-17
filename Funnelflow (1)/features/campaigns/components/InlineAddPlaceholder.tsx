import React, { useState, useRef, useEffect } from 'react';
import { EmailBlockType } from '../../../types';
import TextIcon from '../../../components/icons/TextIcon';
import ImageIcon from '../../../components/icons/ImageIcon';
import ButtonIcon from '../../../components/icons/ButtonIcon';
import ShapeIcon from '../../../components/icons/ShapeIcon';
import PlusIcon from '../../../components/icons/PlusIcon';

interface InlineAddPlaceholderProps {
    onAdd: (type: EmailBlockType) => void;
    isVisible: boolean;
    forceShow?: boolean;
}

const quickAddOptions: { type: EmailBlockType, label: string, icon: React.ElementType }[] = [
    { type: 'text', label: 'Text', icon: TextIcon },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'button', label: 'Button', icon: ButtonIcon },
    { type: 'shape', label: 'Shape', icon: ShapeIcon },
];

const InlineAddPlaceholder: React.FC<InlineAddPlaceholderProps> = ({ onAdd, isVisible, forceShow = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`relative group h-4 ${forceShow ? '' : '-mb-4'}`}>
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${forceShow ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className="h-[1px] w-full bg-sky-500/50"></div>
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-sky-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                    {isMenuOpen && (
                        <div ref={menuRef} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-700 rounded-lg shadow-xl flex items-center gap-2">
                           {quickAddOptions.map(({ type, label, icon: Icon }) => (
                                <button
                                    key={type}
                                    title={label}
                                    onClick={() => { onAdd(type); setIsMenuOpen(false); }}
                                    className="p-2 rounded-md text-slate-300 hover:bg-slate-600 hover:text-white"
                                >
                                    <Icon className="w-5 h-5"/>
                                </button>
                           ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InlineAddPlaceholder;
