import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Automation } from '../../types';
import { useAppContext } from '../../AppContext';

interface RenameAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  automation: Automation | null;
}

const RenameAutomationModal: React.FC<RenameAutomationModalProps> = ({ isOpen, onClose, automation }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');

    useEffect(() => {
        if (automation) {
            setName(automation.name);
        }
    }, [automation]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !automation) return;
        dispatch({ type: 'RENAME_AUTOMATION', payload: { id: automation.id, name: name.trim() } });
        onClose();
    }

    if (!automation) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Rename Automation`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Automation Name"
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

export default RenameAutomationModal;