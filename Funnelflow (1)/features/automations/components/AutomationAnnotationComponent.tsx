import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AutomationAnnotation } from '../../../types';

interface AutomationAnnotationComponentProps {
    annotation: AutomationAnnotation;
    isSelected: boolean;
    onUpdate: (annotation: AutomationAnnotation) => void;
    onClick: (e: React.MouseEvent, id: string) => void;
    onContextMenu: (e: React.MouseEvent, id: string) => void;
}

const AutomationAnnotationComponent: React.FC<AutomationAnnotationComponentProps> = ({ annotation, isSelected, onUpdate, onClick, onContextMenu }) => {
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [label, setLabel] = useState(annotation.label);
    const [dragInfo, setDragInfo] = useState<{ type: 'move' | 'resize', startX: number, startY: number, startWidth: number, startHeight: number, startPosX: number, startPosY: number } | null>(null);
    const labelInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingLabel && labelInputRef.current) {
            labelInputRef.current.focus();
            labelInputRef.current.select();
        }
    }, [isEditingLabel]);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
    };

    const handleLabelBlur = () => {
        setIsEditingLabel(false);
        onUpdate({ ...annotation, label });
    };

    const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLabelBlur();
        }
    };
    
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, type: 'move' | 'resize') => {
        e.stopPropagation();
        setDragInfo({
            type,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: annotation.size.width,
            startHeight: annotation.size.height,
            startPosX: annotation.position.x,
            startPosY: annotation.position.y,
        });
    }, [annotation]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragInfo) return;
        e.preventDefault();
        e.stopPropagation();

        const dx = e.clientX - dragInfo.startX;
        const dy = e.clientY - dragInfo.startY;

        if (dragInfo.type === 'move') {
            onUpdate({ ...annotation, position: { x: dragInfo.startPosX + dx, y: dragInfo.startPosY + dy } });
        } else { // resize
            const newWidth = Math.max(200, dragInfo.startWidth + dx);
            const newHeight = Math.max(100, dragInfo.startHeight + dy);
            onUpdate({ ...annotation, size: { width: newWidth, height: newHeight } });
        }
    }, [dragInfo, onUpdate, annotation]);

    const handleMouseUp = useCallback(() => {
        setDragInfo(null);
    }, []);

    useEffect(() => {
        if (dragInfo) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragInfo, handleMouseMove, handleMouseUp]);


    return (
        <div
            className={`absolute bg-sky-500/10 border-2 rounded-lg p-2 ${isSelected ? 'border-sky-400' : 'border-sky-500/50 border-dashed'}`}
            style={{
                left: annotation.position.x,
                top: annotation.position.y,
                width: annotation.size.width,
                height: annotation.size.height,
                cursor: dragInfo?.type === 'move' ? 'grabbing' : 'grab',
                zIndex: 1
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
            onClick={(e) => onClick(e, annotation.id)}
            onDoubleClick={() => setIsEditingLabel(true)}
            onContextMenu={(e) => onContextMenu(e, annotation.id)}
        >
            {isEditingLabel ? (
                <input
                    ref={labelInputRef}
                    type="text"
                    value={label}
                    onChange={handleLabelChange}
                    onBlur={handleLabelBlur}
                    onKeyDown={handleLabelKeyDown}
                    className="w-auto bg-slate-900 text-white font-semibold focus:outline-none p-1 rounded"
                    onClick={e => e.stopPropagation()}
                />
            ) : (
                <div className="font-semibold text-white px-1 select-none">{annotation.label}</div>
            )}
            <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
            />
        </div>
    );
};

export default AutomationAnnotationComponent;
