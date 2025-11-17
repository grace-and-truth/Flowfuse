
import React, { useState } from 'react';
import Card from '../../components/Card';
import { Asset } from '../../types';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import { useAppContext } from '../../AppContext';
import AssetEditorModal from './AssetEditorModal.tsx';
import ImageIcon from '../../components/icons/ImageIcon';
import PageIcon from '../../components/icons/PageIcon';
import VideoIcon from '../../components/icons/VideoIcon';
import BookIcon from '../../components/icons/BookIcon';
import CampaignIcon from '../../components/icons/CampaignIcon';
import DocumentIcon from '../../components/icons/DocumentIcon';
import DropdownMenu from '../../components/DropdownMenu';


const AssetTypeIcon: React.FC<{ type: Asset['type'] }> = ({ type }) => {
    const className = "w-6 h-6";
    switch (type) {
        case 'image': return <ImageIcon className={`${className} text-purple-400`} />;
        case 'video': return <VideoIcon className={`${className} text-red-400`} />;
        case 'pdf': return <PageIcon className={`${className} text-red-400`} />;
        case 'document': return <DocumentIcon className={`${className} text-slate-400`} />;
        case 'book': return <BookIcon className={`${className} text-orange-400`} />;
        case 'course': return <DocumentIcon className={`${className} text-green-400`} />;
        case 'newsletter': return <CampaignIcon className={`${className} text-blue-400`} />;
        case 'drip_content': return <DocumentIcon className={`${className} text-yellow-400`} />;
        default: return <DocumentIcon className={`${className} text-slate-400`} />;
    }
};

const StatusBadge: React.FC<{ status: Asset['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full capitalize";
    if (status === 'free') return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>{status}</span>;
    if (status === 'paid') return <span className={`${baseClasses} bg-orange-500/20 text-orange-400`}>{status}</span>;
    return <span className={`${baseClasses} bg-slate-600/20 text-slate-400`}>{status}</span>;
};


const AssetsView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    const handleDelete = (asset: Asset) => {
        if (window.confirm(`Are you sure you want to delete "${asset.name}"?`)) {
            dispatch({ type: 'DELETE_ASSET', payload: asset.id });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'ASSET', description: `Asset "${asset.name}" was deleted.` }
            });
        }
    };
    
    const handleEdit = (asset: Asset) => {
        setEditingAsset(asset);
        setModalOpen(true);
    };

    const handleToggleStatus = (asset: Asset) => {
        let newStatus: Asset['status'];
        if (asset.status === 'free') {
            newStatus = 'paid';
        } else if (asset.status === 'paid') {
            newStatus = 'system';
        } else {
            newStatus = 'free';
        }
        dispatch({ type: 'UPDATE_ASSET', payload: { ...asset, status: newStatus } });
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: { type: 'ASSET', description: `Asset "${asset.name}" status changed to "${newStatus}".` }
        });
    };

    const assetActions = (asset: Asset) => [
        { label: 'Edit', onClick: () => handleEdit(asset) },
        { label: `Set as ${asset.status === 'free' ? 'Paid' : (asset.status === 'paid' ? 'System' : 'Free')}`, onClick: () => handleToggleStatus(asset) },
        { label: 'Delete', onClick: () => handleDelete(asset), className: 'text-red-400' },
    ];


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Assets</h1>
                <button onClick={() => { setEditingAsset(null); setModalOpen(true); }} className="flex items-center bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Upload Asset
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-700">
                            <tr>
                                <th className="p-4 font-semibold text-slate-400">Name</th>
                                <th className="p-4 font-semibold text-slate-400">Type</th>
                                <th className="p-4 font-semibold text-slate-400">Status</th>
                                <th className="p-4 font-semibold text-slate-400">URL</th>
                                <th className="p-4 font-semibold text-slate-400">Uploaded</th>
                                <th className="p-4 font-semibold text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.assets.map((asset, index) => (
                                <tr key={asset.id} className={`border-b border-slate-700/50 ${index === state.assets.length - 1 ? 'border-b-0' : ''}`}>
                                    <td className="p-4 text-white font-medium flex items-center">
                                        <div className="mr-3"><AssetTypeIcon type={asset.type} /></div>
                                        {asset.name}
                                    </td>
                                    <td className="p-4 text-slate-300 capitalize">{asset.type.replace(/_/g, ' ')}</td>
                                    <td className="p-4"><StatusBadge status={asset.status} /></td>
                                    <td className="p-4 text-slate-300 font-mono text-sm max-w-sm truncate">
                                        <a href={asset.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">{asset.url}</a>
                                    </td>
                                    <td className="p-4 text-slate-300">{asset.uploadedAt}</td>
                                    <td className="p-4">
                                        <DropdownMenu actions={assetActions(asset)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {state.assets.length === 0 && <p className="text-center text-slate-400 py-8">No assets uploaded yet.</p>}
                </div>
            </Card>

            <AssetEditorModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                asset={editingAsset}
            />
        </div>
    );
};

export default AssetsView;