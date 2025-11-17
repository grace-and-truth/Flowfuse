import React, { useState } from 'react';
import Card from '../../components/Card';
import { Automation } from '../../types';
import PlusIcon from '../../components/icons/PlusIcon';
import { useAppContext } from '../../AppContext';
import DropdownMenu from '../../components/DropdownMenu';
import AutomationEditor from './AutomationEditor';
import RenameAutomationModal from './RenameAutomationModal';
import Modal from '../../components/Modal';

const AddAutomationModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        dispatch({ type: 'ADD_AUTOMATION', payload: { name }});
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: { type: 'AUTOMATION', description: `New automation "${name}" was created.`}
        });
        onClose();
        setName('');
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Automation">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Automation Name"
                    required
                    className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">Create Automation</button>
                </div>
            </form>
        </Modal>
    )
};


const AutomationsView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [renamingAutomation, setRenamingAutomation] = useState<Automation | null>(null);
    const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

    const handleDelete = (automation: Automation) => {
        if (window.confirm(`Are you sure you want to delete the automation "${automation.name}"? This action cannot be undone.`)) {
            dispatch({ type: 'DELETE_AUTOMATION', payload: automation.id });
             dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'AUTOMATION', description: `Automation "${automation.name}" was deleted.`}
            });
        }
    };
    
    const handleToggle = (automation: Automation) => {
        dispatch({ type: 'TOGGLE_AUTOMATION_STATUS', payload: automation.id });
    };
    
    if (selectedAutomation) {
        return <AutomationEditor automation={selectedAutomation} onClose={() => setSelectedAutomation(null)} />;
    }
    
    const automationActions = (automation: Automation) => [
        { label: 'Edit Workflow', onClick: () => setSelectedAutomation(automation) },
        { label: 'Rename', onClick: () => setRenamingAutomation(automation) },
        { label: 'Delete', onClick: () => handleDelete(automation), className: 'text-red-400' },
    ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Automations</h1>
        <button onClick={() => setCreateModalOpen(true)} className="flex items-center bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Automation
        </button>
      </div>
      
      <div className="space-y-4">
        {state.automations.map(automation => (
          <Card key={automation.id} className="flex justify-between items-center">
            <div className="flex-1 cursor-pointer" onClick={() => setSelectedAutomation(automation)}>
              <h2 className="text-lg font-semibold text-white">{automation.name}</h2>
              <p className="text-sm text-slate-400">
                {automation.nodes.length} step{automation.nodes.length !== 1 && 's'} in workflow
              </p>
            </div>
            <div className="flex items-center space-x-4">
               <div className="flex items-center cursor-pointer" onClick={() => handleToggle(automation)}>
                 <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${automation.isActive ? 'bg-green-500' : 'bg-slate-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${automation.isActive ? 'translate-x-4' : ''}`}></div>
                 </div>
                 <span className="text-sm ml-2 hidden sm:inline">{automation.isActive ? 'Active' : 'Inactive'}</span>
               </div>
               <DropdownMenu actions={automationActions(automation)} />
            </div>
          </Card>
        ))}
        {state.automations.length === 0 && <Card><p className="text-center text-slate-400 py-8">No automations configured. Create your first workflow!</p></Card>}
      </div>
      <AddAutomationModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
      <RenameAutomationModal isOpen={!!renamingAutomation} onClose={() => setRenamingAutomation(null)} automation={renamingAutomation} />
    </div>
  );
};

export default AutomationsView;