import React, { useState } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { Webhook } from '../../types';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import { useAppContext } from '../../AppContext';

const AddWebhookForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { dispatch } = useAppContext();
    const [url, setUrl] = useState('');
    const [event, setEvent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !event) return;
        dispatch({ type: 'ADD_WEBHOOK', payload: { url, event } });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Webhook URL" required className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
            <input type="text" value={event} onChange={e => setEvent(e.target.value)} placeholder="Event (e.g., 'contact.created')" required className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">Create Webhook</button>
            </div>
        </form>
    );
};

const WebhooksView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to delete this webhook?')) {
          dispatch({ type: 'DELETE_WEBHOOK', payload: id });
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Webhooks</h1>
        <button onClick={() => setModalOpen(true)} className="flex items-center bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Webhook
        </button>
      </div>

      <Card className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="p-4 font-semibold text-slate-400">URL</th>
                <th className="p-4 font-semibold text-slate-400">Event</th>
                <th className="p-4 font-semibold text-slate-400">Last Triggered</th>
                <th className="p-4 font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.webhooks.map((hook, index) => (
                <tr key={hook.id} className={`border-b border-slate-700/50 ${index === state.webhooks.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="p-4 text-white font-mono text-sm break-all">{hook.url}</td>
                  <td className="p-4">
                     <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{hook.event}</span>
                  </td>
                  <td className="p-4 text-slate-300">{hook.lastTriggered || 'Never'}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(hook.id)} className="text-red-400 hover:text-red-300 p-1">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {state.webhooks.length === 0 && <p className="text-center text-slate-400 py-8">No webhooks created yet.</p>}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Webhook">
        <AddWebhookForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default WebhooksView;