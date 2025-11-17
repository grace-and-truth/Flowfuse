import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import LinkInput from './LinkInput';

interface LinkEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { text: string, url: string }) => void;
    initialText?: string;
    initialUrl?: string;
}

const LinkEditorModal: React.FC<LinkEditorModalProps> = ({ isOpen, onClose, onSave, initialText = '', initialUrl = '' }) => {
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (isOpen) {
            setText(initialText);
            setUrl(initialUrl);
        }
    }, [isOpen, initialText, initialUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ text, url });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Hyperlink">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-400 block mb-1">Text to display</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Link text"
                        className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400 block mb-1">Link to</label>
                    <LinkInput href={url} onHrefChange={setUrl} />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LinkEditorModal;
