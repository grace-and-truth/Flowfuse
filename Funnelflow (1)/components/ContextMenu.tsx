import React, { useEffect, useRef, useState } from 'react';

interface ContextAction {
  label: string;
  action: () => void;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  actions: ContextAction[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, actions, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: y, left: x });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  useEffect(() => {
    if (menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        let newTop = y;
        let newLeft = x;
        
        if (y + menuRect.height > window.innerHeight) {
            newTop = y - menuRect.height;
        }
        if (x + menuRect.width > window.innerWidth) {
            newLeft = x - menuRect.width;
        }
        setPosition({ top: newTop, left: newLeft });
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-slate-700 border border-slate-600 rounded-md shadow-lg z-50 py-1"
      style={{ top: position.top, left: position.left }}
    >
      <ul>
        {actions.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => {
                if (!item.disabled) {
                  item.action();
                  onClose();
                }
              }}
              disabled={item.disabled}
              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;