import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Automation, AutomationEdge, AutomationNode, AutomationAnnotation } from '../../types';
import { useAppContext } from '../../AppContext';
import ChevronLeftIcon from '../../components/icons/ChevronLeftIcon';
import AutomationNodeComponent from './components/AutomationNode';
import NodeSidebar from './components/NodeSidebar';
import NodeConfigPanel from './components/NodeConfigPanel';
import ContextMenu from '../../components/ContextMenu';
import { v4 as uuidv4 } from 'uuid';
import AutomationAnnotationComponent from './components/AutomationAnnotationComponent';

interface AutomationEditorProps {
    automation: Automation;
    onClose: () => void;
}

const getEdgePath = (sourceNode: AutomationNode, targetNode: AutomationNode, sourceHandle: string) => {
    const handleOffset = sourceHandle === 'yes' ? -10 : (sourceHandle === 'no' ? 10 : 0);
    const sourceX = sourceNode.position.x + 240; // width of node
    const sourceY = sourceNode.position.y + 35 + handleOffset; // middle of node
    const targetX = targetNode.position.x;
    const targetY = targetNode.position.y + 35;

    const dx = Math.abs(targetX - sourceX);
    const controlPointX = sourceX + dx * 0.5;

    return `M ${sourceX} ${sourceY} C ${controlPointX} ${sourceY}, ${controlPointX} ${targetY}, ${targetX} ${targetY}`;
};

const AutomationEditor: React.FC<AutomationEditorProps> = ({ automation: initialAutomation, onClose }) => {
    const { dispatch } = useAppContext();
    const [automation, setAutomation] = useState(initialAutomation);
    const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
    const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
    const [draggingNode, setDraggingNode] = useState<{ id: string, offsetX: number, offsetY: number } | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: any[] } | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    
    const singleSelectedNode = useMemo(() => {
        if (selectedNodeIds.length !== 1) return null;
        return automation.nodes.find(n => n.id === selectedNodeIds[0]);
    }, [selectedNodeIds, automation.nodes]);

    const handleSave = () => {
        dispatch({ type: 'UPDATE_AUTOMATION', payload: automation });
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: { type: 'AUTOMATION', description: `Workflow for "${automation.name}" was updated.`}
        });
        onClose();
    };
    
    const handleAddNode = (type: 'action' | 'delay' | 'condition', position?: { x: number; y: number }) => {
        let newNodeData;
        switch (type) {
            case 'action':
                newNodeData = { label: 'New Action', actionType: 'sendEmail' };
                break;
            case 'delay':
                newNodeData = { label: 'New Delay', durationValue: 1, durationUnit: 'days' };
                break;
            case 'condition':
                newNodeData = { label: 'New Condition', conditionType: 'hasTag' };
                break;
        }

        const newNode: AutomationNode = {
            id: uuidv4(),
            type,
            data: newNodeData,
            position: position || { x: 200, y: 100 },
        };
        setAutomation(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
    };

    const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        if (contextMenu) setContextMenu(null);
        setSelectedAnnotationId(null);

        if (e.shiftKey) {
            setSelectedNodeIds(prev => 
                prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
            );
        } else {
            if (!selectedNodeIds.includes(nodeId)) {
                setSelectedNodeIds([nodeId]);
            }
        }
    };
    
    const handleCanvasClick = () => {
        setSelectedNodeIds([]);
        setSelectedAnnotationId(null);
        if (contextMenu) setContextMenu(null);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
        e.stopPropagation();
        const node = automation.nodes.find(n => n.id === nodeId);
        if (node && editorRef.current) {
            const rect = editorRef.current.getBoundingClientRect();
            setDraggingNode({
                id: nodeId,
                offsetX: e.clientX - rect.left - node.position.x,
                offsetY: e.clientY - rect.top - node.position.y,
            });
        }
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!draggingNode || !editorRef.current) return;
        const rect = editorRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - draggingNode.offsetX;
        const y = e.clientY - rect.top - draggingNode.offsetY;
        
        setAutomation(prev => ({
            ...prev,
            nodes: prev.nodes.map(n => n.id === draggingNode.id ? { ...n, position: { x, y } } : n)
        }));

    }, [draggingNode]);

    const handleMouseUp = useCallback(() => {
        setDraggingNode(null);
    }, []);

    useEffect(() => {
        if (draggingNode) {
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
    }, [draggingNode, handleMouseMove, handleMouseUp]);

    const handleDeleteSelected = () => {
        if (selectedNodeIds.length === 0) return;
        setAutomation(prev => {
            const triggerNode = prev.nodes.find(n => n.type === 'trigger');
            const idsToDelete = selectedNodeIds.filter(id => id !== triggerNode?.id);
            if(idsToDelete.length === 0) return prev;
            return {
                ...prev,
                nodes: prev.nodes.filter(n => !idsToDelete.includes(n.id)),
                edges: prev.edges.filter(e => !idsToDelete.includes(e.source) && !idsToDelete.includes(e.target)),
            };
        });
        setSelectedNodeIds([]);
    };

    const handleDuplicateSelected = () => {
        if (selectedNodeIds.length === 0) return;
        setAutomation(prev => {
            const newNodes: AutomationNode[] = [];
            selectedNodeIds.forEach(id => {
                const originalNode = prev.nodes.find(n => n.id === id);
                if (originalNode && originalNode.type !== 'trigger') {
                    newNodes.push({
                        ...originalNode,
                        id: uuidv4(),
                        position: { x: originalNode.position.x + 20, y: originalNode.position.y + 20 },
                    });
                }
            });
            return { ...prev, nodes: [...prev.nodes, ...newNodes] };
        });
    };
    
    const handleAddAnnotation = (position: {x: number, y: number}) => {
        const newAnnotation: AutomationAnnotation = {
            id: uuidv4(),
            label: 'New Group',
            position,
            size: { width: 400, height: 250 },
        };
        setAutomation(prev => ({ ...prev, annotations: [...(prev.annotations || []), newAnnotation] }));
    };

    const handleAnnotationClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedAnnotationId(id);
        setSelectedNodeIds([]);
    };

    const handleAnnotationUpdate = (updatedAnnotation: AutomationAnnotation) => {
        setAutomation(prev => ({
            ...prev,
            annotations: prev.annotations?.map(a => a.id === updatedAnnotation.id ? updatedAnnotation : a) || [],
        }));
    };

    const handleDeleteAnnotation = () => {
        if (!selectedAnnotationId) return;
        setAutomation(prev => ({
            ...prev,
            annotations: prev.annotations?.filter(a => a.id !== selectedAnnotationId) || [],
        }));
        setSelectedAnnotationId(null);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const activeEl = document.activeElement;
                if (!activeEl || (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA')) {
                    if (selectedNodeIds.length > 0) handleDeleteSelected();
                    if (selectedAnnotationId) handleDeleteAnnotation();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeIds, selectedAnnotationId, automation]);

    const handleContextMenu = (e: React.MouseEvent, contextId?: string, contextType: 'node' | 'annotation' | 'canvas' = 'canvas') => {
        e.preventDefault();
        e.stopPropagation();
        
        const editorBounds = editorRef.current?.getBoundingClientRect();
        if (!editorBounds) return;

        const mouseX = e.clientX - editorBounds.left;
        const mouseY = e.clientY - editorBounds.top;
        
        const items: any[] = [];

        if (contextType === 'node' && contextId) {
            if (!selectedNodeIds.includes(contextId)) {
                setSelectedNodeIds([contextId]);
                setSelectedAnnotationId(null);
            }
             items.push({ label: `Delete ${selectedNodeIds.length > 1 ? 'Nodes' : 'Node'}`, action: handleDeleteSelected });
            items.push({ label: `Duplicate ${selectedNodeIds.length > 1 ? 'Nodes' : 'Node'}`, action: handleDuplicateSelected });

        } else if (contextType === 'annotation' && contextId) {
            setSelectedAnnotationId(contextId);
            setSelectedNodeIds([]);
            items.push({ label: 'Delete Group', action: handleDeleteAnnotation });
        } else { // canvas
            setSelectedNodeIds([]);
            setSelectedAnnotationId(null);
            items.push({ label: 'Add Annotation Group', action: () => handleAddAnnotation({ x: mouseX, y: mouseY }) });
            items.push({ label: 'Add Action Node', action: () => handleAddNode('action', { x: mouseX, y: mouseY }) });
            items.push({ label: 'Add Delay Node', action: () => handleAddNode('delay', { x: mouseX, y: mouseY }) });
            items.push({ label: 'Add Condition Node', action: () => handleAddNode('condition', { x: mouseX, y: mouseY }) });
        }

        if (items.length > 0) {
            setContextMenu({ x: e.clientX, y: e.clientY, items });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="flex-shrink-0 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <button onClick={onClose} className="p-2 mr-2 rounded-full hover:bg-slate-700">
                        <ChevronLeftIcon className="w-6 h-6"/>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white">{automation.name}</h1>
                        <p className="text-sm text-slate-400">Workflow Editor</p>
                    </div>
                </div>
                <button onClick={handleSave} className="bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                    Save and Close
                </button>
            </header>
            <div className="flex-1 flex overflow-hidden">
                <NodeSidebar onAddNode={handleAddNode} />
                <main ref={editorRef} onClick={handleCanvasClick} onContextMenu={handleContextMenu} className="flex-1 relative bg-slate-900 overflow-auto bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]">
                    
                    {(automation.annotations || []).map(annotation => (
                        <AutomationAnnotationComponent
                            key={annotation.id}
                            annotation={annotation}
                            isSelected={selectedAnnotationId === annotation.id}
                            onUpdate={handleAnnotationUpdate}
                            onClick={handleAnnotationClick}
                            onContextMenu={(e, id) => handleContextMenu(e, id, 'annotation')}
                        />
                    ))}
                    
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                            </marker>
                        </defs>
                        {automation.edges.map(edge => {
                            const sourceNode = automation.nodes.find(n => n.id === edge.source);
                            const targetNode = automation.nodes.find(n => n.id === edge.target);
                            if (!sourceNode || !targetNode) return null;
                            const path = getEdgePath(sourceNode, targetNode, edge.sourceHandle || 'default');
                            return <path key={edge.id} d={path} stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />;
                        })}
                    </svg>

                    {automation.nodes.map(node => (
                        <div
                            key={node.id}
                            style={{ position: 'absolute', top: node.position.y, left: node.position.x, cursor: draggingNode ? 'grabbing' : 'grab', zIndex: 2 }}
                            onMouseDown={(e) => handleMouseDown(e, node.id)}
                            onClick={(e) => handleNodeClick(e, node.id)}
                            onContextMenu={(e) => handleContextMenu(e, node.id, 'node')}
                        >
                            <AutomationNodeComponent node={node} isSelected={selectedNodeIds.includes(node.id)} />
                        </div>
                    ))}
                    {contextMenu && (
                        <ContextMenu
                            x={contextMenu.x}
                            y={contextMenu.y}
                            actions={contextMenu.items}
                            onClose={() => setContextMenu(null)}
                        />
                    )}
                </main>
                {singleSelectedNode && (
                    <NodeConfigPanel 
                        key={singleSelectedNode.id}
                        node={singleSelectedNode}
                        automation={automation}
                        onUpdate={(updatedNode, updatedEdges) => {
                            setAutomation(prev => ({
                                ...prev,
                                nodes: prev.nodes.map(n => n.id === updatedNode.id ? updatedNode : n),
                                edges: updatedEdges || prev.edges
                            }));
                        }}
                        onDelete={(nodeId) => {
                            setAutomation(prev => ({
                                ...prev,
                                nodes: prev.nodes.filter(n => n.id !== nodeId),
                                edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
                            }));
                            setSelectedNodeIds(prev => prev.filter(id => id !== nodeId));
                        }}
                        onClose={() => setSelectedNodeIds([])}
                    />
                )}
            </div>
        </div>
    );
};

export default AutomationEditor;