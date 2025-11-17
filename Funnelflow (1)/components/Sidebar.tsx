import React from 'react';
import { View } from '../types';
import HomeIcon from './icons/HomeIcon';
import FunnelIcon from './icons/FunnelIcon';
import UsersIcon from './icons/UsersIcon';
import AutomationIcon from './icons/AutomationIcon';
import CampaignIcon from './icons/CampaignIcon';
import WebhookIcon from './icons/WebhookIcon';
import SettingsIcon from './icons/SettingsIcon';
import ArchiveIcon from './icons/ArchiveIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const navigationItems = [
  { view: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { view: 'funnels', label: 'Funnels', icon: FunnelIcon },
  { view: 'contacts', label: 'Contacts', icon: UsersIcon },
  { view: 'automations', label: 'Automations', icon: AutomationIcon },
  { view: 'campaigns', label: 'Campaigns', icon: CampaignIcon },
  { view: 'assets', label: 'Assets', icon: ArchiveIcon },
  { view: 'webhooks', label: 'Webhooks', icon: WebhookIcon },
  { view: 'settings', label: 'Settings', icon: SettingsIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setOpen }) => {
  const handleNavigation = (view: View) => {
    setCurrentView(view);
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  const NavItem: React.FC<{ item: typeof navigationItems[0] }> = ({ item }) => (
    <li>
      <button
        onClick={() => handleNavigation(item.view as View)}
        className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          currentView === item.view
            ? 'bg-sky-500 text-white shadow-md'
            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
        }`}
      >
        <item.icon className="w-6 h-6 mr-3" />
        <span className="font-medium">{item.label}</span>
      </button>
    </li>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      ></div>
      <aside
        className={`fixed lg:relative inset-y-0 left-0 bg-slate-800 border-r border-slate-700/50 w-64 p-4 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:flex lg:flex-col`}
      >
        <div className="flex items-center mb-8">
          <div className="bg-sky-500 p-2 rounded-lg mr-3">
             <FunnelIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">FunnelFlow</h1>
        </div>
        <nav className="flex-1">
          <ul>
            {navigationItems.map((item) => (
              <NavItem key={item.view} item={item} />
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
            <div className="p-4 rounded-lg bg-slate-700/50 text-center">
                <p className="text-sm text-slate-400">Upgrade to Pro</p>
                <p className="text-xs text-slate-500 mb-3">Unlock all features and advanced analytics.</p>
                <button className="w-full bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors">
                    Upgrade
                </button>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;