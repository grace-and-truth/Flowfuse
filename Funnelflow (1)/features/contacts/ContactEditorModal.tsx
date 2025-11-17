import React, { useState, useEffect, KeyboardEvent } from 'react';
import Modal from '../../components/Modal';
import { Contact } from '../../types';
import { useAppContext } from '../../AppContext';

interface ContactEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Contact | null;
}

const ContactEditorModal: React.FC<ContactEditorModalProps> = ({ isOpen, onClose, contact }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const isEditing = contact !== null;

    useEffect(() => {
        if (contact) {
            setName(contact.name);
            setEmail(contact.email);
            setTags(contact.tags);
        } else {
            // Reset for new contact
            setName('');
            setEmail('');
            setTags([]);
        }
    }, [contact]);

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        } else if (e.key === 'Backspace' && tagInput === '') {
            setTags(tags.slice(0, -1));
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        const payload = { name, email, tags };

        if (isEditing) {
            dispatch({
                type: 'UPDATE_CONTACT',
                payload: { ...contact, ...payload }
            });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'CONTACT', description: `Contact ${name} was updated.` }
            });
        } else {
            dispatch({
                type: 'ADD_CONTACT',
                payload: payload
            });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'CONTACT', description: `New contact ${name} was added.` }
            });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Contact' : 'Add New Contact'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                
                <div>
                    <label className="text-sm text-slate-400 mb-1 block">Tags</label>
                    <div className="w-full p-2 bg-slate-700 rounded-md flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-sky-500">
                        {tags.map(tag => (
                            <span key={tag} className="flex items-center bg-sky-500 text-white text-sm font-medium px-2 py-1 rounded">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 text-sky-200 hover:text-white">
                                    &times;
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder={tags.length === 0 ? "Add tags (press Enter)" : ""}
                            className="bg-transparent flex-grow focus:outline-none text-white"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">
                        {isEditing ? 'Save Changes' : 'Add Contact'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ContactEditorModal;