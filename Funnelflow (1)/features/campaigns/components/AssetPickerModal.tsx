import React from 'react';
import Modal from '../../../components/Modal';
import { Asset } from '../../../types';
import { useAppContext } from '../../../AppContext';
import ImageIcon from '../../../components/icons/ImageIcon';
import PageIcon from '../../../components/icons/PageIcon';
import VideoIcon from '../../../components/icons/VideoIcon';
import BookIcon from '../../../components/icons/BookIcon';
import CampaignIcon from '../../../components/icons/CampaignIcon';
import DocumentIcon from '../../../components/icons/DocumentIcon';

interface AssetPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

const AssetTypeIconPicker: React.FC<{ type: Asset['type'] }> = ({ type }) => {
    const className = "w-5 h-5"; // Smaller for picker
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


const AssetPickerModal: React.FC<AssetPickerModalProps> = ({ isOpen, onClose, onSelect }) => {
    const { state } = useAppContext();

    const handleSelect = (asset: Asset) => {
        onSelect(asset.url);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select an Asset">
            <div className="p-4 h-[60vh] overflow-y-auto">
                {state.assets.length > 0 ? (
                    <ul className="space-y-2">
                        {state.assets.map(asset => (
                            <li key={asset.id}>
                                <button
                                    onClick={() => handleSelect(asset)}
                                    className="w-full flex items-center text-left p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                                >
                                    <div className="mr-3"><AssetTypeIconPicker type={asset.type} /></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{asset.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{asset.url}</p>
                                    </div>
                                    <StatusBadge status={asset.status} />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12 text-slate-400">
                        <p>No assets found.</p>
                        <p className="text-sm">Upload assets in the "Assets" section.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AssetPickerModal;