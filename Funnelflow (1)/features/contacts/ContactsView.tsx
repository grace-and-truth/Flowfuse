import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import { Contact } from '../../types';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import TagIcon from '../../components/icons/TagIcon';
import { useAppContext } from '../../AppContext';
import ContactEditorModal from './ContactEditorModal';
import DropdownMenu from '../../components/DropdownMenu';
import Modal from '../../components/Modal';


const BulkActionsBar: React.FC<{
    selectedIds: string[];
    onClear: () => void;
    onAddTags: () => void;
    onDelete: () => void;
}> = ({ selectedIds, onClear, onAddTags, onDelete }) => {
    if (selectedIds.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl px-4 py-3 flex items-center space-x-4 z-20">
            <span className="font-semibold text-white">{selectedIds.length} selected</span>
            <button onClick={onAddTags} className="flex items-center text-sky-400 hover:text-sky-300 font-medium text-sm">
                <TagIcon className="w-4 h-4 mr-1.5" />
                Add Tags
            </button>
            <button onClick={onDelete} className="flex items-center text-red-400 hover:text-red-300 font-medium text-sm">
                <TrashIcon className="w-4 h-4 mr-1.5" />
                Delete
            </button>
            <button onClick={onClear} className="text-slate-400 hover:text-white text-sm font-medium">Clear</button>
        </div>
    );
};

const AddTagsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (tags: string[]) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [tags, setTags] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
        if (tagArray.length > 0) {
            onSubmit(tagArray);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Tags to Selected Contacts">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="Tags to add (comma-separated)"
                    className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    autoFocus
                />
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">Add Tags</button>
                </div>
            </form>
        </Modal>
    );
};


const ContactsView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [editingContact, setEditingContact] = useState<Contact | 'new' | null>(null);
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
    const [isAddTagsModalOpen, setAddTagsModalOpen] = useState(false);
    
    const isAllSelected = useMemo(() => 
        state.contacts.length > 0 && selectedContactIds.length === state.contacts.length,
        [selectedContactIds, state.contacts.length]
    );

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedContactIds(state.contacts.map(c => c.id));
        } else {
            setSelectedContactIds([]);
        }
    };

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (e.target.checked) {
            setSelectedContactIds(prev => [...prev, id]);
        } else {
            setSelectedContactIds(prev => prev.filter(contactId => contactId !== id));
        }
    };

    const handleDelete = (contact: Contact) => {
        if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
            dispatch({ type: 'DELETE_CONTACT', payload: contact.id });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'CONTACT', description: `Contact ${contact.name} was deleted.` }
            });
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedContactIds.length} contacts?`)) {
            dispatch({ type: 'BULK_DELETE_CONTACTS', payload: { contactIds: selectedContactIds } });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'CONTACT', description: `${selectedContactIds.length} contacts were deleted.` }
            });
            setSelectedContactIds([]);
        }
    };
    
    const handleBulkAddTags = (tags: string[]) => {
        dispatch({ type: 'BULK_ADD_TAGS', payload: { contactIds: selectedContactIds, tags } });
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: { type: 'CONTACT', description: `Added tags to ${selectedContactIds.length} contacts.` }
        });
        setSelectedContactIds([]);
    };
    
    const contactActions = (contact: Contact) => [
        { label: 'Edit', onClick: () => setEditingContact(contact) },
        { label: 'Delete', onClick: () => handleDelete(contact), className: 'text-red-400' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Contacts</h1>
                <button onClick={() => setEditingContact('new')} className="flex items-center bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Contact
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-700">
                            <tr>
                                <th className="p-4 w-12">
                                    <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="bg-slate-600 border-slate-500 rounded text-sky-500 focus:ring-sky-500" />
                                </th>
                                <th className="p-4 font-semibold text-slate-400">Name</th>
                                <th className="p-4 font-semibold text-slate-400">Email</th>
                                <th className="p-4 font-semibold text-slate-400">Subscribed</th>
                                <th className="p-4 font-semibold text-slate-400">Tags</th>
                                <th className="p-4 font-semibold text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.contacts.map((contact, index) => (
                                <tr key={contact.id} className={`border-b border-slate-700/50 ${selectedContactIds.includes(contact.id) ? 'bg-slate-700/50' : ''} ${index === state.contacts.length - 1 ? 'border-b-0' : ''}`}>
                                    <td className="p-4">
                                        <input type="checkbox" checked={selectedContactIds.includes(contact.id)} onChange={(e) => handleSelectOne(e, contact.id)} className="bg-slate-600 border-slate-500 rounded text-sky-500 focus:ring-sky-500" />
                                    </td>
                                    <td className="p-4 text-white font-medium">{contact.name}</td>
                                    <td className="p-4 text-slate-300">{contact.email}</td>
                                    <td className="p-4 text-slate-300">{contact.subscribedAt}</td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2 max-w-sm">
                                            {contact.tags.map(tag => (
                                                <span key={tag} className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <DropdownMenu actions={contactActions(contact)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {state.contacts.length === 0 && <p className="text-center text-slate-400 py-8">No contacts yet. Add your first one!</p>}
                </div>
            </Card>

            <BulkActionsBar 
                selectedIds={selectedContactIds}
                onClear={() => setSelectedContactIds([])}
                onAddTags={() => setAddTagsModalOpen(true)}
                onDelete={handleBulkDelete}
            />
            
            <AddTagsModal 
                isOpen={isAddTagsModalOpen}
                onClose={() => setAddTagsModalOpen(false)}
                onSubmit={handleBulkAddTags}
            />

            {editingContact && (
                <ContactEditorModal
                    isOpen={!!editingContact}
                    onClose={() => setEditingContact(null)}
                    contact={editingContact === 'new' ? null : editingContact}
                />
            )}
        </div>
    );
};

export default ContactsView;