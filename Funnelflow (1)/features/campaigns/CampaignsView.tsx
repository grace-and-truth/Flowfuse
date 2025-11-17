import React, { useState } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { Campaign } from '../../types';
import PlusIcon from '../../components/icons/PlusIcon';
import { useAppContext } from '../../AppContext';
import DropdownMenu from '../../components/DropdownMenu';
import CampaignEditorModal from './CampaignEditorModal';
import RenameCampaignModal from './RenameCampaignModal';

const StatusBadge: React.FC<{ status: Campaign['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full capitalize";
    if (status === 'sent') return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>{status}</span>;
    if (status === 'scheduled') return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>{status}</span>;
    return <span className={`${baseClasses} bg-slate-600 text-slate-300`}>{status}</span>;
};


const CampaignsView: React.FC = () => {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [renamingCampaign, setRenamingCampaign] = useState<Campaign | null>(null);
  const { state, dispatch } = useAppContext();

  const handleOpenEditor = (campaign: Campaign | null = null) => {
    setEditingCampaign(campaign);
    setEditorOpen(true);
  }

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setEditingCampaign(null);
  }

  const handleDelete = (campaign: Campaign) => {
      if (window.confirm(`Are you sure you want to delete the campaign "${campaign.name}"?`)) {
          dispatch({ type: 'DELETE_CAMPAIGN', payload: campaign.id });
          dispatch({
            type: 'ADD_ACTIVITY',
            payload: { type: 'CAMPAIGN', description: `Campaign '${campaign.name}' was deleted.`}
          });
      }
  };

  const handleDuplicate = (campaign: Campaign) => {
      dispatch({ type: 'DUPLICATE_CAMPAIGN', payload: campaign.id });
      dispatch({
            type: 'ADD_ACTIVITY',
            payload: { type: 'CAMPAIGN', description: `Campaign '${campaign.name}' was duplicated.`}
          });
  };

  const campaignActions = (campaign: Campaign) => [
      { label: 'Edit', onClick: () => handleOpenEditor(campaign) },
      { label: 'Rename', onClick: () => setRenamingCampaign(campaign) },
      { label: 'Duplicate', onClick: () => handleDuplicate(campaign) },
      { label: 'Delete', onClick: () => handleDelete(campaign), className: 'text-red-400' },
  ];

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Campaigns</h1>
            <button onClick={() => handleOpenEditor(null)} className="flex items-center bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                <PlusIcon className="w-5 h-5 mr-2" />
                New Campaign
            </button>
        </div>
      
      <Card className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="p-4 font-semibold text-slate-400">Campaign</th>
                <th className="p-4 font-semibold text-slate-400">Status</th>
                <th className="p-4 font-semibold text-slate-400">Recipients</th>
                <th className="p-4 font-semibold text-slate-400">Open Rate</th>
                <th className="p-4 font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.campaigns.map((campaign, index) => (
                <tr key={campaign.id} className={`border-b border-slate-700/50 ${index === state.campaigns.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="p-4">
                    <button onClick={() => handleOpenEditor(campaign)} className="text-left hover:text-sky-400">
                      <p className="text-white font-medium">{campaign.name}</p>
                      <p className="text-sm text-slate-400 truncate max-w-xs">{campaign.subject}</p>
                    </button>
                  </td>
                  <td className="p-4"><StatusBadge status={campaign.status} /></td>
                  <td className="p-4 text-slate-300">{campaign.recipients.toLocaleString()}</td>
                  <td className="p-4 text-slate-300">{campaign.status === 'sent' ? `${campaign.openRate}%` : '-'}</td>
                  <td className="p-4">
                     <DropdownMenu actions={campaignActions(campaign)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {state.campaigns.length === 0 && <p className="text-center text-slate-400 py-8">No campaigns yet. Create one!</p>}
        </div>
      </Card>
      
      {isEditorOpen && (
          <CampaignEditorModal 
            isOpen={isEditorOpen} 
            onClose={handleCloseEditor}
            campaign={editingCampaign}
          />
      )}

      <RenameCampaignModal 
        isOpen={!!renamingCampaign}
        onClose={() => setRenamingCampaign(null)}
        campaign={renamingCampaign}
      />
    </div>
  );
};

export default CampaignsView;