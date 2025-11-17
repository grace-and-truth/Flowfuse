import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Asset } from '../../types';
import { useAppContext } from '../../AppContext';

interface AssetEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset?: Asset | null; // Make asset optional for 'add' mode
}

const assetTypes: { value: Asset['type']; label: string }[] = [
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'pdf', label: 'PDF' },
    { value: 'document', label: 'Document' },
    { value: 'book', label: 'Book' },
    { value: 'course', label: 'Course' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'drip_content', label: 'Drip Content' },
    { value: 'other', label: 'Other' },
];

const assetStatuses: { value: Asset['status']; label: string }[] = [
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
    { value: 'system', label: 'System' },
];

const AssetEditorModal: React.FC<AssetEditorModalProps> = ({ isOpen, onClose, asset }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState<Asset['type']>('image');
    const [status, setStatus] = useState<Asset['status']>('free');

    const isEditing = asset !== undefined && asset !== null;

    useEffect(() => {
        if (isOpen) {
            if (isEditing && asset) {
                setName(asset.name);
                setUrl(asset.url);
                setType(asset.type);
                setStatus(asset.status);
            } else {
                // Reset for new asset
                setName('');
                setUrl('');
                setType('image');
                setStatus('free');
            }
        }
    }, [isOpen, asset, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !url) return;

        const payload = { name, url, type, status };

        if (isEditing && asset) {
            dispatch({ type: 'UPDATE_ASSET', payload: { ...asset, ...payload } });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'ASSET', description: `Asset "${name}" was updated.` }
            });
        } else {
            dispatch({ type: 'ADD_ASSET', payload: payload });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'ASSET', description: `New asset "${name}" was uploaded.` }
            });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Asset' : 'Upload New Asset'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-400 -mt-2">
                    {isEditing ? 'Edit the details of this asset.' : 'Simulate uploading a new file to your asset library.'}
                </p>
                <div>
                    <label className="text-sm font-medium text-slate-400">Asset Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Company Logo" required className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400">File URL</label>
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.png" required className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-slate-400">Asset Type</label>
                    <select value={type} onChange={e => setType(e.target.value as Asset['type'])} className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                        {assetTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400">Asset Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as Asset['status'])} className="mt-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                        {assetStatuses.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">
                        {isEditing ? 'Save Changes' : 'Add Asset'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AssetEditorModal;