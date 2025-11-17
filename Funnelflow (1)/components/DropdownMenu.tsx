import React, { useState, useRef, useEffect } from 'react';
import MoreVerticalIcon from './icons/MoreVerticalIcon';

interface DropdownAction {
  label: string;
  onClick: () => void;
  className?: string;
}

interface DropdownMenuProps {
  actions: DropdownAction[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
      >
        <MoreVerticalIcon className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {actions.map((action, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 ${action.className || ''}`}
                >
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;