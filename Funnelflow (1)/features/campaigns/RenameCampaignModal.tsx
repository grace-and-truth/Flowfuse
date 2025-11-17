import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Campaign } from '../../types';
import { useAppContext } from '../../AppContext';

interface RenameCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

const RenameCampaignModal: React.FC<RenameCampaignModalProps> = ({ isOpen, onClose, campaign }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');

    useEffect(() => {
        if (campaign) {
            setName(campaign.name);
        }
    }, [campaign]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !campaign) return;
        dispatch({ type: 'RENAME_CAMPAIGN', payload: { id: campaign.id, name: name.trim() } });
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: { type: 'CAMPAIGN', description: `Campaign "${campaign.name}" was renamed to "${name.trim()}".`}
        });
        onClose();
    }

    if (!campaign) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Rename Campaign`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Campaign Name"
                    required
                    className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    autoFocus
                />
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">Save Changes</button>
                </div>
            </form>
        </Modal>
    )
};

export default RenameCampaignModal;