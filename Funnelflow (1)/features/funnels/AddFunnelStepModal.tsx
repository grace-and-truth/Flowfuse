import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { PageType, FunnelStepType } from '../../types';
import { useAppContext } from '../../AppContext';
import PageIcon from '../../components/icons/PageIcon';
import CampaignIcon from '../../components/icons/CampaignIcon';
import ClockIcon from '../../components/icons/ClockIcon';

interface AddFunnelStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  funnelId: string;
}

const stepTypes: { type: FunnelStepType; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { type: 'page', label: 'Page', icon: PageIcon },
  { type: 'email', label: 'Email', icon: CampaignIcon },
  { type: 'delay', label: 'Delay', icon: ClockIcon },
];

export const pageTypes: { value: PageType; label: string }[] = [
    { value: 'squeeze', label: 'Squeeze Page / Opt-in' },
    { value: 'sales', label: 'Sales Page' },
    { value: 'order', label: 'Order Form' },
    { value: 'upsell', label: 'Upsell Page' },
    { value: 'downsell', label: 'Downsell Page' },
    { value: 'thankyou', label: 'Thank You Page' },
    { value: 'membership', label: 'Membership Area' },
    { value: 'optout', label: 'Opt-Out / Unsubscribe' },
    { value: 'custom', label: 'Custom Page' },
];

const AddFunnelStepModal: React.FC<AddFunnelStepModalProps> = ({ isOpen, onClose, funnelId }) => {
  const { dispatch } = useAppContext();
  const [selectedType, setSelectedType] = useState<FunnelStepType>('page');
  const [name, setName] = useState('');
  const [pageType, setPageType] = useState<PageType>('squeeze');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (selectedType === 'delay' && !duration)) return;

    const isVisualStep = selectedType === 'page' || selectedType === 'email';

    const stepData = {
        name,
        type: selectedType,
        pageType: selectedType === 'page' ? pageType : undefined,
        duration: selectedType === 'delay' ? duration : undefined,
        body: isVisualStep ? [] : undefined,
        style: isVisualStep ? { bodyBackgroundColor: '#f1f5f9', contentBackgroundColor: '#ffffff' } : undefined,
    };
    
    dispatch({ type: 'ADD_FUNNEL_STEP', payload: { funnelId, stepData } });
    onClose();
  };

  const renderFields = () => {
    switch (selectedType) {
      case 'page':
        return (
            <select 
                value={pageType} 
                onChange={e => setPageType(e.target.value as PageType)}
                className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
                {pageTypes.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
            </select>
        );
      case 'delay':
        return <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g., 1 day, 6 hours" required className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Funnel Step">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
            {stepTypes.map(({ type, label, icon: Icon }) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${selectedType === type ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    <Icon className="w-6 h-6 mb-2"/>
                    <span className="text-sm font-semibold">{label}</span>
                </button>
            ))}
        </div>

        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Step Name" required className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
        
        {renderFields()}

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
          <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">Add Step</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFunnelStepModal;