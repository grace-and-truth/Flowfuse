import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EmailBlock } from '../../../../types';

interface ShapeBlockProps {
    block: EmailBlock;
    onUpdate: (block: EmailBlock) => void;
    isSelected: boolean;
}

const getShapePath = (type: EmailBlock['props']['shapeType'], w: number, h: number): string => {
    switch (type) {
        case 'triangle-up':
            return `M ${w / 2} 0 L ${w} ${h} L 0 ${h} Z`;
        case 'triangle-down':
            return `M 0 0 L ${w} 0 L ${w / 2} ${h} Z`;
        case 'star':
            const outerRadius = w / 2;
            const innerRadius = w / 4;
            let path = 'M ';
            for (let i = 0; i < 10; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * 36 * Math.PI) / 180;
                path += `${outerRadius + radius * Math.cos(angle)},${outerRadius + radius * Math.sin(angle)} L `;
            }
            return path.slice(0, -2) + ' Z';
        case 'circle':
             return `M ${w/2}, ${h/2} m -${w/2}, 0 a ${w/2},${h/2} 0 1,0 ${w},0 a ${w/2},${h/2} 0 1,0 -${w},0`;
        default: // rectangle
            return `M 0 0 H ${w} V ${h} H 0 Z`;
    }
};

const ShapeBlock: React.FC<ShapeBlockProps> = ({ block, onUpdate, isSelected }) => {
    const { 
        shapeType = 'rectangle',
        backgroundColor = '#3b82f6', 
        width = 200, 
        height = 100,
        rotation = 0,
        shapeText,
        shapeTextColor = '#ffffff',
        shapeFontSize = 16,
        fontFamily = 'Arial, sans-serif'
    } = block.props;
    
    const blockRef = useRef<HTMLDivElement>(null);
    const [interaction, setInteraction] = useState<{ type: 'resize' | 'rotate', startX: number, startY: number, startW: number, startH: number, startRot: number, centerX: number, centerY: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent, type: 'resize' | 'rotate') => {
        e.preventDefault();
        e.stopPropagation();
        if (!blockRef.current) return;
        const rect = blockRef.current.getBoundingClientRect();
        setInteraction({
            type,
            startX: e.clientX,
            startY: e.clientY,
            startW: width,
            startH: height,
            startRot: rotation,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
        });
    };
    
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!interaction) return;

        if (interaction.type === 'resize') {
            const dx = e.clientX - interaction.startX;
            const dy = e.clientY - interaction.startY;
            onUpdate({
                ...block,
                props: {
                    ...block.props,
                    width: Math.max(20, interaction.startW + dx * 2),
                    height: Math.max(20, interaction.startH + dy * 2),
                }
            });
        } else { // rotate
            const angleRad = Math.atan2(e.clientY - interaction.centerY, e.clientX - interaction.centerX);
            let angleDeg = angleRad * (180 / Math.PI) + 90; // Adjust for handle position
            if (angleDeg < 0) angleDeg += 360;
            onUpdate({ ...block, props: { ...block.props, rotation: Math.round(angleDeg) } });
        }
    }, [interaction, onUpdate, block]);

    const handleMouseUp = useCallback(() => {
        setInteraction(null);
    }, []);

    useEffect(() => {
        if (interaction) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [interaction, handleMouseMove, handleMouseUp]);


    const isCircle = shapeType === 'circle';
    const isStar = shapeType === 'star';
    const displaySize = isCircle || isStar ? Math.max(width, height) : width;

    return (
        <div style={{ padding: '30px' }} ref={blockRef}>
            <div
                style={{
                    position: 'relative',
                    width: `${displaySize}px`,
                    height: `${isCircle || isStar ? displaySize : height}px`,
                    margin: '0 auto',
                    transform: `rotate(${rotation}deg)`,
                }}
            >
                <svg
                    viewBox={`0 0 ${isCircle || isStar ? displaySize : width} ${isCircle || isStar ? displaySize : height}`}
                    width="100%" height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    <path d={getShapePath(shapeType, isCircle || isStar ? displaySize : width, isCircle || isStar ? displaySize : height)} fill={backgroundColor} />
                </svg>
                {shapeText && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: shapeTextColor,
                        fontSize: `${shapeFontSize}px`,
                        fontFamily: fontFamily,
                        width: '90%',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                    }}>
                        {shapeText}
                    </div>
                )}
                 {isSelected && (
                    <>
                        {/* Rotate Handle */}
                        <div
                            className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-sky-500 rounded-full cursor-alias border-2 border-white shadow-lg"
                            onMouseDown={(e) => handleMouseDown(e, 'rotate')}
                        />
                        <div className="absolute -top-3 left-1/2 h-3 w-px bg-sky-500" />

                        {/* Resize Handle */}
                        <div
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-sky-500 rounded-full cursor-nwse-resize border-2 border-white shadow-lg"
                            onMouseDown={(e) => handleMouseDown(e, 'resize')}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ShapeBlock;