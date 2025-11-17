import React from 'react';
import CampaignIcon from '../../../components/icons/CampaignIcon';
import ClockIcon from '../../../components/icons/ClockIcon';
import IfIcon from '../../../components/icons/IfIcon';

interface NodeSidebarProps {
    onAddNode: (type: 'action' | 'delay' | 'condition') => void;
}

const NodeButton: React.FC<{label: string, icon: React.ReactNode, onClick: () => void}> = ({label, icon, onClick}) => (
    <button
        onClick={onClick}
        className="w-full flex flex-col items-center p-3 my-1 rounded-lg transition-colors duration-200 text-slate-400 hover:bg-slate-700 hover:text-white"
    >
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
    </button>
);

const NodeSidebar: React.FC<NodeSidebarProps> = ({ onAddNode }) => {
    return (
        <aside className="w-24 bg-slate-800 border-r border-slate-700/50 p-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase text-center mb-2">Add Node</h3>
            <NodeButton label="Action" icon={<CampaignIcon className="w-6 h-6"/>} onClick={() => onAddNode('action')} />
            <NodeButton label="Delay" icon={<ClockIcon className="w-6 h-6"/>} onClick={() => onAddNode('delay')} />
            <NodeButton label="Condition" icon={<IfIcon className="w-6 h-6"/>} onClick={() => onAddNode('condition')} />
        </aside>
    );
};

export default NodeSidebar;