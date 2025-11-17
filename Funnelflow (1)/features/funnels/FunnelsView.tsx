import React, { useState } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { Funnel, FunnelStep, Template } from '../../types';
import PlusIcon from '../../components/icons/PlusIcon';
import EditFunnelStepModal from './EditFunnelStepModal';
import { useAppContext } from '../../AppContext';
import AddFunnelStepModal from './AddFunnelStepModal';
import PageIcon from '../../components/icons/PageIcon';
import CampaignIcon from '../../components/icons/CampaignIcon';
import ClockIcon from '../../components/icons/ClockIcon';
import ChevronLeftIcon from '../../components/icons/ChevronLeftIcon';
import PencilIcon from '../../components/icons/PencilIcon';
import ArrowDownIcon from '../../components/icons/ArrowDownIcon';
import DropdownMenu from '../../components/DropdownMenu';
import PreviewStepModal from './PreviewStepModal';
import RenameFunnelModal from './RenameFunnelModal';

const AddFunnelModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        dispatch({ type: 'ADD_FUNNEL', payload: { name }});
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: { type: 'FUNNEL', description: `New funnel "${name}" was created.`}
        });
        onClose();
        setName('');
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Funnel">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Funnel Name"
                    required
                    className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">Create Funnel</button>
                </div>
            </form>
        </Modal>
    )
};

const FunnelStepCard: React.FC<{ step: FunnelStep, actionsMenu: React.ReactNode }> = ({ step, actionsMenu }) => {
    const icons = {
        page: <PageIcon className="w-6 h-6 text-sky-400" />,
        email: <CampaignIcon className="w-6 h-6 text-green-400" />,
        delay: <ClockIcon className="w-6 h-6 text-yellow-400" />,
    };

    const pageTypeLabels: Record<string, string> = {
        squeeze: "Squeeze Page", sales: "Sales Page", order: "Order Form", upsell: "Upsell",
        downsell: "Downsell", thankyou: "Thank You", custom: "Custom Page", 
        membership: "Membership", optout: "Opt-Out"
    };

    const getSubtext = () => {
        if (step.type === 'page') return `Page: ${pageTypeLabels[step.pageType || 'custom'] || 'Page'}`;
        if (step.type === 'email') return 'Send Email';
        if (step.type === 'delay') return `Wait for ${step.duration || '...'}`;
        return '';
    };

    return (
        <Card className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-slate-700 mr-4">
                    {icons[step.type]}
                </div>
                <div>
                    <h3 className="font-semibold text-white">{step.name}</h3>
                    <p className="text-sm text-slate-400 capitalize">{getSubtext()}</p>
                </div>
            </div>
            {actionsMenu}
        </Card>
    );
};

const FunnelsView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedFunnelId, setSelectedFunnelId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isAddStepModalOpen, setAddStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<FunnelStep | null>(null);
  const [renamingFunnel, setRenamingFunnel] = useState<Funnel | null>(null);
  const [previewItem, setPreviewItem] = useState<FunnelStep | Template | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [funnelName, setFunnelName] = useState('');

  const selectedFunnel = state.funnels.find(f => f.id === selectedFunnelId);

  const handleDeleteFunnel = (id: string) => {
      if (window.confirm('Are you sure you want to delete this entire funnel and all its steps?')) {
          dispatch({ type: 'DELETE_FUNNEL', payload: id });
          if (selectedFunnelId === id) setSelectedFunnelId(null);
      }
  };
  
  const handleNameUpdate = () => {
      if (selectedFunnel && funnelName.trim() && funnelName !== selectedFunnel.name) {
          dispatch({ type: 'UPDATE_FUNNEL', payload: { id: selectedFunnel.id, name: funnelName.trim() } });
      }
      setIsEditingName(false);
  };
  
  const handleDeleteStep = (stepId: string) => {
      if (!selectedFunnelId) return;
      dispatch({ type: 'DELETE_FUNNEL_STEP', payload: { funnelId: selectedFunnelId, stepId } });
  };
  
  const handlePreview = (item: FunnelStep | Template) => setPreviewItem(item);

  const renderFunnelDetails = (funnel: Funnel) => {
      if (funnelName !== funnel.name && !isEditingName) setFunnelName(funnel.name);

      const stepActions = (step: FunnelStep) => [
          { label: 'Edit Step', onClick: () => setEditingStep(step) },
          { label: 'Preview Step', onClick: () => handlePreview(step) },
          { label: 'Delete Step', onClick: () => handleDeleteStep(step.id), className: 'text-red-400' },
      ];

      return (
          <div>
              <div className="flex items-center mb-6">
                   <button onClick={() => setSelectedFunnelId(null)} className="lg:hidden p-2 mr-2 rounded-full hover:bg-slate-700">
                      <ChevronLeftIcon className="w-6 h-6"/>
                   </button>
                   {isEditingName ? (
                      <input
                          type="text"
                          value={funnelName}
                          onBlur={handleNameUpdate}
                          onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
                          onChange={(e) => setFunnelName(e.target.value)}
                          className="text-3xl font-bold text-white bg-transparent border-b-2 border-sky-500 focus:outline-none"
                          autoFocus
                      />
                   ) : (
                      <h1 className="text-3xl font-bold text-white mr-4">{funnel.name}</h1>
                   )}
                   {!isEditingName && (
                       <button onClick={() => setIsEditingName(true)} className="text-slate-400 hover:text-white">
                          <PencilIcon className="w-5 h-5"/>
                       </button>
                   )}
                   <button onClick={() => setAddStepModalOpen(true)} className="ml-auto flex items-center bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Add Step
                  </button>
              </div>
              <div className="max-w-2xl mx-auto">
                  {funnel.steps.length > 0 ? (
                  <div className="space-y-2">
                      {funnel.steps.map((step, index) => (
                          <React.Fragment key={step.id}>
                              <FunnelStepCard step={step} actionsMenu={<DropdownMenu actions={stepActions(step)} />} />
                              {index < funnel.steps.length - 1 && (
                                   <div className="flex justify-center"><ArrowDownIcon className="w-5 h-5 text-slate-500" /></div>
                              )}
                          </React.Fragment>
                      ))}
                  </div>
                  ) : (
                      <Card className="text-center py-12"><p className="text-slate-400">This funnel has no steps yet.</p></Card>
                  )}
              </div>
          </div>
      );
  };

  const renderFunnelList = () => {
    const funnelActions = (funnel: Funnel) => [
        { label: 'Open Funnel', onClick: () => setSelectedFunnelId(funnel.id) },
        { label: 'Rename Funnel', onClick: () => setRenamingFunnel(funnel) },
        { label: 'Delete Funnel', onClick: () => handleDeleteFunnel(funnel.id), className: 'text-red-400' },
    ];
    return (
      <div>
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Funnels</h1>
              <button onClick={() => setCreateModalOpen(true)} className="flex items-center bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  New Funnel
              </button>
          </div>
          <div className="space-y-4">
              {state.funnels.map(funnel => (
                  <Card key={funnel.id} className="flex justify-between items-center">
                      <div className="cursor-pointer flex-grow" onClick={() => setSelectedFunnelId(funnel.id)}>
                          <h2 className="text-lg font-semibold text-white">{funnel.name}</h2>
                          <p className="text-sm text-slate-400">{funnel.steps.length} steps</p>
                      </div>
                      <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${funnel.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-300'}`}>
                              {funnel.isActive ? 'Active' : 'Inactive'}
                          </span>
                           <DropdownMenu actions={funnelActions(funnel)} />
                      </div>
                  </Card>
              ))}
          </div>
      </div>
    );
  };
  
  const showDetails = selectedFunnelId && selectedFunnel;
  
  return (
      <>
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 h-full">
            <div className={`lg:block ${showDetails ? 'hidden' : 'block'}`}>{renderFunnelList()}</div>
            <div className={`lg:col-span-2 ${showDetails ? 'block' : 'hidden lg:block'}`}>
                {showDetails ? renderFunnelDetails(selectedFunnel) : (
                    <Card className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-white">Select a funnel</h2>
                            <p className="text-slate-400">Choose a funnel from the list to view its details.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
        <AddFunnelModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
        <RenameFunnelModal isOpen={!!renamingFunnel} onClose={() => setRenamingFunnel(null)} funnel={renamingFunnel} />
        {showDetails && <AddFunnelStepModal isOpen={isAddStepModalOpen} onClose={() => setAddStepModalOpen(false)} funnelId={selectedFunnel.id}/>}
        {editingStep && selectedFunnel && <EditFunnelStepModal isOpen={!!editingStep} onClose={() => setEditingStep(null)} step={editingStep} funnelId={selectedFunnel.id} onPreviewTemplate={handlePreview} />}
        <PreviewStepModal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} item={previewItem}/>
      </>
  );
};

export default FunnelsView;