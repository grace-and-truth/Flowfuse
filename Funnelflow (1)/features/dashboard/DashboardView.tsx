import React from 'react';
import Card from '../../components/Card';
import UsersIcon from '../../components/icons/UsersIcon';
import CampaignIcon from '../../components/icons/CampaignIcon';
import FunnelIcon from '../../components/icons/FunnelIcon';
import { useAppContext } from '../../AppContext';
import { ActivityLog } from '../../types';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <Card className="flex items-center p-5">
        <div className="p-3 rounded-full bg-sky-500/20 text-sky-400 mr-4">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </Card>
);

const ActivityItem: React.FC<{ log: ActivityLog }> = ({ log }) => {
    const colorClasses: Record<string, string> = {
        'CONTACT': 'bg-green-500/20 text-green-400',
        'CAMPAIGN': 'bg-blue-500/20 text-blue-400',
        'FUNNEL': 'bg-purple-500/20 text-purple-400',
        'SYSTEM': 'bg-slate-500/20 text-slate-400',
        'ASSET': 'bg-indigo-500/20 text-indigo-400',
    }
    
    return (
        <li className="flex items-center text-sm">
            <span className={`w-24 text-center rounded-md px-2 py-1 mr-3 font-mono text-xs ${colorClasses[log.type] || colorClasses['SYSTEM']}`}>{log.type}</span>
            <span>{log.description}</span>
            <span className="ml-auto text-slate-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
        </li>
    );
};

const DashboardView: React.FC = () => {
  const { state } = useAppContext();
  
  const activeCampaigns = state.campaigns.filter(c => c.status === 'sent' || c.status === 'scheduled').length;
  const activeFunnels = state.funnels.filter(f => f.isActive).length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Contacts" value={state.contacts.length.toLocaleString()} icon={UsersIcon} />
        <StatCard title="Active Campaigns" value={activeCampaigns.toLocaleString()} icon={CampaignIcon} />
        <StatCard title="Active Funnels" value={activeFunnels.toLocaleString()} icon={FunnelIcon} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            {state.activityLog.length > 0 ? (
                <ul className="space-y-4">
                    {state.activityLog.slice(0, 5).map(log => <ActivityItem key={log.id} log={log} />)}
                </ul>
            ) : (
                <p className="text-slate-400 text-center py-8">No recent activity.</p>
            )}
        </Card>
        <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Campaign Performance</h2>
            <p className="text-slate-400">Performance charts will be displayed here.</p>
            <div className="h-48 flex items-center justify-center bg-slate-700/50 rounded-lg mt-4">
                <span className="text-slate-500">Chart Placeholder</span>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;