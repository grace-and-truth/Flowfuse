import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { View } from './types';
import DashboardView from './features/dashboard/DashboardView';
import FunnelsView from './features/funnels/FunnelsView';
import ContactsView from './features/contacts/ContactsView';
import AutomationsView from './features/automations/AutomationsView';
import CampaignsView from './features/campaigns/CampaignsView';
import WebhooksView from './features/webhooks/WebhooksView';
import SettingsView from './features/settings/SettingsView';
import { AppProvider } from './AppContext';
import AssetsView from './features/assets/AssetsView';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'funnels':
        return <FunnelsView />;
      case 'contacts':
        return <ContactsView />;
      case 'automations':
        return <AutomationsView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'webhooks':
        return <WebhooksView />;
      case 'settings':
        return <SettingsView />;
      case 'assets':
        return <AssetsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-slate-900 text-slate-300 font-sans">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4 sm:p-6 lg:p-8">
            {renderView()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
