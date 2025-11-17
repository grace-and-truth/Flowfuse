import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Funnel } from '../../types';
import { useAppContext } from '../../AppContext';

interface RenameFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  funnel: Funnel | null;
}

const RenameFunnelModal: React.FC<RenameFunnelModalProps> = ({ isOpen, onClose, funnel }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');

    useEffect(() => {
        if (funnel) {
            setName(funnel.name);
        }
    }, [funnel]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !funnel) return;
        dispatch({ type: 'UPDATE_FUNNEL', payload: { id: funnel.id, name: name.trim() } });
        onClose();
    }

    if (!funnel) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Rename Funnel`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Funnel Name"
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

export default RenameFunnelModal;