import React, { useState, useEffect } from 'react';
import { Automation, AutomationEdge, AutomationNode, FunnelStep } from '../../../types';
import { useAppContext } from '../../../AppContext';
import TrashIcon from '../../../components/icons/TrashIcon';
import { v4 as uuidv4 } from 'uuid';

interface NodeConfigPanelProps {
    node: AutomationNode;
    automation: Automation;
    onUpdate: (node: AutomationNode, edges?: AutomationEdge[]) => void;
    onDelete: (nodeId: string) => void;
    onClose: () => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, automation, onUpdate, onDelete, onClose }) => {
    const { state } = useAppContext();
    const [localNode, setLocalNode] = useState(node);
    const [selectedFunnelSteps, setSelectedFunnelSteps] = useState<FunnelStep[]>([]);

    useEffect(() => {
        setLocalNode(node);
    }, [node]);

    // Update available funnel steps when funnelId changes
    useEffect(() => {
        if (localNode.data.triggerFunnelId) {
            const funnel = state.funnels.find(f => f.id === localNode.data.triggerFunnelId);
            setSelectedFunnelSteps(funnel?.steps || []);
        } else if (localNode.data.conditionFunnelId) {
            const funnel = state.funnels.find(f => f.id === localNode.data.conditionFunnelId);
            setSelectedFunnelSteps(funnel?.steps || []);
        } else {
            setSelectedFunnelSteps([]);
        }
    }, [localNode.data.triggerFunnelId, localNode.data.conditionFunnelId, state.funnels]);

    const handleDataChange = (field: string, value: any) => {
        const updatedNode = { ...localNode, data: { ...localNode.data, [field]: value } };
        setLocalNode(updatedNode);
        onUpdate(updatedNode);
    };
    
    const handleConnectionChange = (targetId: string, sourceHandle: 'default' | 'yes' | 'no') => {
        // Remove existing edge from this source/handle
        const otherEdges = automation.edges.filter(e => !(e.source === node.id && e.sourceHandle === sourceHandle));
        
        if(targetId) { // If a valid target is selected
            const newEdge: AutomationEdge = {
                id: uuidv4(),
                source: node.id,
                target: targetId,
                sourceHandle: sourceHandle
            };
            onUpdate(localNode, [...otherEdges, newEdge]);
        } else { // If 'None' is selected
             onUpdate(localNode, otherEdges);
        }
    }

    const otherNodes = automation.nodes.filter(n => n.id !== node.id);

    const ConnectionSelector: React.FC<{label: string, sourceHandle: 'default' | 'yes' | 'no'}> = ({label, sourceHandle}) => {
        const currentEdge = automation.edges.find(e => e.source === node.id && e.sourceHandle === sourceHandle);
        return (
            <div>
                <label className="text-sm font-medium text-slate-400">{label}</label>
                <select 
                    value={currentEdge?.target || ''}
                    onChange={(e) => handleConnectionChange(e.target.value, sourceHandle)}
                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                    <option value="">None</option>
                    {otherNodes.map(n => <option key={n.id} value={n.id}>{n.data.label}</option>)}
                </select>
            </div>
        )
    }

    const renderFields = () => {
        switch (node.type) {
            case 'trigger':
                return (
                    <>
                        <label className="text-sm font-medium text-slate-400">Trigger Type</label>
                        <select
                            value={localNode.data.triggerType || 'contactSubscribed'}
                            onChange={(e) => handleDataChange('triggerType', e.target.value)}
                            className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="contactSubscribed">Contact Subscribed</option>
                            <option value="campaignOpened">Campaign Opened</option>
                            <option value="campaignClicked">Campaign Clicked</option>
                            <option value="funnelStepViewed">Funnel Step Viewed</option>
                            <option value="funnelPurchaseSuccess">Funnel Purchase Success</option>
                            <option value="funnelExit">Funnel Exit</option>
                        </select>

                        {(localNode.data.triggerType === 'campaignOpened' || localNode.data.triggerType === 'campaignClicked') && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Select Campaign</label>
                                <select
                                    value={localNode.data.triggerCampaignId || ''}
                                    onChange={(e) => handleDataChange('triggerCampaignId', e.target.value)}
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Any Campaign</option>
                                    {state.campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        )}

                        {localNode.data.triggerType === 'campaignClicked' && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Target Link URL (Optional)</label>
                                <input
                                    type="text"
                                    value={localNode.data.triggerTargetLinkUrl || ''}
                                    onChange={(e) => handleDataChange('triggerTargetLinkUrl', e.target.value)}
                                    placeholder="e.g., product-page.com/buy"
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Leave blank for any link click.</p>
                            </div>
                        )}

                        {(localNode.data.triggerType === 'funnelStepViewed' || localNode.data.triggerType === 'funnelPurchaseSuccess' || localNode.data.triggerType === 'funnelExit') && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Select Funnel</label>
                                <select
                                    value={localNode.data.triggerFunnelId || ''}
                                    onChange={(e) => {
                                        handleDataChange('triggerFunnelId', e.target.value);
                                        handleDataChange('triggerFunnelStepId', ''); // Reset step when funnel changes
                                    }}
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Any Funnel</option>
                                    {state.funnels.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                        )}

                        {(localNode.data.triggerType === 'funnelStepViewed' || localNode.data.triggerType === 'funnelExit') && localNode.data.triggerFunnelId && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Select Funnel Step</label>
                                <select
                                    value={localNode.data.triggerFunnelStepId || ''}
                                    onChange={(e) => handleDataChange('triggerFunnelStepId', e.target.value)}
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Any Step</option>
                                    {selectedFunnelSteps.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                {localNode.data.triggerType === 'funnelExit' && <p className="text-xs text-slate-500 mt-1">Trigger if contact exits BEFORE this step.</p>}
                            </div>
                        )}
                        <ConnectionSelector label="First Step" sourceHandle="default"/>
                    </>
                );
            case 'action':
                return (
                    <>
                        <label className="text-sm font-medium text-slate-400">Action Type</label>
                        <select
                            value={localNode.data.actionType}
                            onChange={(e) => handleDataChange('actionType', e.target.value)}
                            className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="sendEmail">Send Email</option>
                            <option value="addTag">Add Tag</option>
                        </select>
                        {localNode.data.actionType === 'sendEmail' && (
                             <>
                                <label className="text-sm font-medium text-slate-400 mt-4">Select Campaign</label>
                                <select
                                    value={localNode.data.campaignId || ''}
                                    onChange={(e) => handleDataChange('campaignId', e.target.value)}
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Select a campaign...</option>
                                    {state.campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-slate-400">Target Tags</label>
                                    <input
                                        type="text"
                                        value={localNode.data.targetTags || ''}
                                        onChange={e => handleDataChange('targetTags', e.target.value)}
                                        placeholder="Target Tags (e.g. lead, prospect)"
                                        className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Comma-separated. Leave blank to target all.</p>
                                </div>
                             </>
                        )}
                        {localNode.data.actionType === 'addTag' && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Tag to add</label>
                                <input
                                    type="text"
                                    value={localNode.data.tagName || ''}
                                    onChange={e => handleDataChange('tagName', e.target.value)}
                                    placeholder="Tag to add"
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        )}
                        <ConnectionSelector label="Next Step" sourceHandle="default"/>
                    </>
                );
            case 'delay':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                             <label className="text-sm font-medium text-slate-400 sr-only">Duration Value</label>
                             <input
                                type="number"
                                value={localNode.data.durationValue || 1}
                                min="1"
                                onChange={e => handleDataChange('durationValue', parseInt(e.target.value))}
                                className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                             <label className="text-sm font-medium text-slate-400 sr-only">Duration Unit</label>
                             <select
                                value={localNode.data.durationUnit || 'days'}
                                onChange={(e) => handleDataChange('durationUnit', e.target.value)}
                                className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                        <ConnectionSelector label="Next Step" sourceHandle="default"/>
                    </div>
                );
            case 'condition':
                return (
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-400">Condition Type</label>
                        <select
                            value={localNode.data.conditionType || 'hasTag'}
                            onChange={(e) => handleDataChange('conditionType', e.target.value)}
                            className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="hasTag">Has Tag</option>
                            <option value="openedCampaign">Opened Campaign</option>
                            <option value="clickedCampaignLink">Clicked Campaign Link</option>
                            <option value="viewedFunnelStep">Viewed Funnel Step</option>
                            <option value="madeFunnelPurchase">Made Funnel Purchase</option>
                        </select>

                        {localNode.data.conditionType === 'hasTag' && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Tag to check</label>
                                <input
                                    type="text"
                                    value={localNode.data.conditionTag || ''}
                                    onChange={e => handleDataChange('conditionTag', e.target.value)}
                                    placeholder="Tag to check"
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        )}

                        {(localNode.data.conditionType === 'openedCampaign' || localNode.data.conditionType === 'clickedCampaignLink') && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Select Campaign</label>
                                <select
                                    value={localNode.data.conditionCampaignId || ''}
                                    onChange={(e) => handleDataChange('conditionCampaignId', e.target.value)}
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Any Campaign</option>
                                    {state.campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        )}

                        {localNode.data.conditionType === 'clickedCampaignLink' && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Target Link URL (Optional)</label>
                                <input
                                    type="text"
                                    value={localNode.data.conditionTargetLinkUrl || ''}
                                    onChange={(e) => handleDataChange('conditionTargetLinkUrl', e.target.value)}
                                    placeholder="e.g., product-page.com/buy"
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Leave blank for any link click.</p>
                            </div>
                        )}

                        {(localNode.data.conditionType === 'viewedFunnelStep' || localNode.data.conditionType === 'madeFunnelPurchase') && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Select Funnel</label>
                                <select
                                    value={localNode.data.conditionFunnelId || ''}
                                    onChange={(e) => {
                                        handleDataChange('conditionFunnelId', e.target.value);
                                        handleDataChange('conditionFunnelStepId', ''); // Reset step when funnel changes
                                    }}
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Any Funnel</option>
                                    {state.funnels.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                        )}

                        {localNode.data.conditionType === 'viewedFunnelStep' && localNode.data.conditionFunnelId && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Select Funnel Step</label>
                                <select
                                    value={localNode.data.conditionFunnelStepId || ''}
                                    onChange={(e) => handleDataChange('conditionFunnelStepId', e.target.value)}
                                    className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Any Step</option>
                                    {selectedFunnelSteps.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        )}

                        <ConnectionSelector label="Path if YES" sourceHandle="yes"/>
                        <ConnectionSelector label="Path if NO" sourceHandle="no"/>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <aside className="w-80 bg-slate-800 border-l border-slate-700/50 p-4 flex flex-col z-20">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Configure Node</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                 <div>
                    <label className="text-sm font-medium text-slate-400">Node Label</label>
                    <input
                        type="text"
                        value={localNode.data.label}
                        onChange={e => handleDataChange('label', e.target.value)}
                        className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
                <hr className="border-slate-700"/>
                {renderFields()}
            </div>
             {node.type !== 'trigger' && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <button onClick={() => onDelete(node.id)} className="w-full flex items-center justify-center text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-md">
                        <TrashIcon className="w-5 h-5 mr-2" />
                        Delete Node
                    </button>
                </div>
            )}
        </aside>
    );
};

export default NodeConfigPanel;