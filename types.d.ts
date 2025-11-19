// types.d.ts
import React from 'react';

// Components
declare module './components/Sidebar' {
  const Sidebar: React.FC<any>;
  export default Sidebar;
}
declare module './components/Header' {
  const Header: React.FC<any>;
  export default Header;
}

// Features
declare module './features/dashboard/DashboardView' {
  const DashboardView: React.FC<any>;
  export default DashboardView;
}
declare module './features/funnels/FunnelsView' {
  const FunnelsView: React.FC<any>;
  export default FunnelsView;
}
declare module './features/contacts/ContactsView' {
  const ContactsView: React.FC<any>;
  export default ContactsView;
}
declare module './features/automations/AutomationsView' {
  const AutomationsView: React.FC<any>;
  export default AutomationsView;
}
declare module './features/campaigns/CampaignsView' {
  const CampaignsView: React.FC<any>;
  export default CampaignsView;
}
declare module './features/webhooks/WebhooksView' {
  const WebhooksView: React.FC<any>;
  export default WebhooksView;
}
declare module './features/settings/SettingsView' {
  const SettingsView: React.FC<any>;
  export default SettingsView;
}
declare module './features/assets/AssetsView' {
  const AssetsView: React.FC<any>;
  export default AssetsView;
}

// Icons (wildcard for any in icons folder)
declare module './components/icons/*' {
  const Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Icon;
}

// AppContext
declare module './AppContext' {
  import React from 'react';
  const AppProvider: React.FC<any>;
  export { AppProvider };
}

// Types file (if View type exists)
declare module './types' {
  export type View =
    | 'dashboard'
    | 'funnels'
    | 'contacts'
    | 'automations'
    | 'campaigns'
    | 'webhooks'
    | 'settings'
    | 'assets';
}
