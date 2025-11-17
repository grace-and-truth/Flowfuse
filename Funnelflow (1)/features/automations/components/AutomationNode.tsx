import React from 'react';
import { AutomationNode } from '../../../types';
import CampaignIcon from '../../../components/icons/CampaignIcon';
import ClockIcon from '../../../components/icons/ClockIcon';
import TagIcon from '../../../components/icons/TagIcon';
import IfIcon from '../../../components/icons/IfIcon';
import AutomationIcon from '../../../components/icons/AutomationIcon';
import EyeIcon from '../../../components/icons/EyeIcon';
import FunnelIcon from '../../../components/icons/FunnelIcon';
import HandPointUpIcon from '../../../components/icons/HandPointUpIcon';
import DollarSignIcon from '../../../components/icons/DollarSignIcon';
import ExitIcon from '../../../components/icons/ExitIcon';


interface AutomationNodeProps {
    node: AutomationNode;
    isSelected: boolean;
}

const NodeIcon: React.FC<{node: AutomationNode}> = ({node}) => {
    const className="w-5 h-5";
    if (node.type === 'trigger') {
        switch (node.data.triggerType) {
            case 'contactSubscribed': return <AutomationIcon className={className}/>;
            case 'campaignOpened': return <EyeIcon className={className}/>;
            case 'campaignClicked': return <HandPointUpIcon className={className}/>;
            case 'funnelStepViewed': return <FunnelIcon className={className}/>;
            case 'funnelPurchaseSuccess': return <DollarSignIcon className={className}/>;
            case 'funnelExit': return <ExitIcon className={className}/>;
            default: return <AutomationIcon className={className}/>;
        }
    }
    if (node.type === 'delay') return <ClockIcon className={className}/>;
    if (node.type === 'condition') {
        switch (node.data.conditionType) {
            case 'hasTag': return <TagIcon className={className}/>;
            case 'openedCampaign': return <EyeIcon className={className}/>;
            case 'clickedCampaignLink': return <HandPointUpIcon className={className}/>;
            case 'viewedFunnelStep': return <FunnelIcon className={className}/>;
            case 'madeFunnelPurchase': return <DollarSignIcon className={className}/>;
            default: return <IfIcon className={className}/>;
        }
    }
    if (node.type === 'action') {
        if (node.data.actionType === 'addTag') return <TagIcon className={className} />
        if (node.data.actionType === 'sendEmail') return <CampaignIcon className={className} />
    }
    return <AutomationIcon className={className}/>;
}

const getHandleLabel = (handle: string) => {
    if (handle === 'yes') return "YES";
    if (handle === 'no') return "NO";
    return null;
}

const AutomationNodeComponent: React.FC<AutomationNodeProps> = ({ node, isSelected }) => {
    const nodeColors = {
        trigger: 'border-t-sky-500',
        action: 'border-t-purple-500',
        delay: 'border-t-yellow-500',
        condition: 'border-t-green-500',
    };

    const hasSourceHandles = node.type === 'condition';
    const hasTargetHandle = true; // All nodes can be targeted

    return (
        <div 
            className={`w-60 bg-slate-800 rounded-lg shadow-lg border-2 ${isSelected ? 'border-sky-400' : 'border-slate-700'} border-t-4 ${nodeColors[node.type]} relative`}
            style={{ zIndex: 1 }}
        >
            {hasTargetHandle && <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-800" />}

            <div className="p-3">
                <div className="flex items-center mb-1">
                    <div className="mr-2 text-slate-400"><NodeIcon node={node}/></div>
                    <h3 className="font-bold text-white text-sm">{node.data.label}</h3>
                </div>
                <p className="text-xs text-slate-400 capitalize">{node.type}</p>
            </div>

            {hasSourceHandles ? (
                <>
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 -mt-2.5 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-800" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 -mt-2.5 text-xs font-bold text-green-400">{getHandleLabel('yes')}</span>
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 mt-2.5 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-800" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 mt-2.5 text-xs font-bold text-red-400">{getHandleLabel('no')}</span>
                </>
            ) : (
                node.type !== 'action' && <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-800" />
            )}
        </div>
    );
};

export default AutomationNodeComponent;