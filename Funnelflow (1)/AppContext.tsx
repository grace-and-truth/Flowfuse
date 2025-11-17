import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
    Contact,
    Campaign,
    Funnel,
    FunnelStep,
    Automation,
    Webhook,
    PaymentGateway,
    ActivityLog,
    EmailBlock,
    Asset
} from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
    contacts: Contact[];
    campaigns: Campaign[];
    funnels: Funnel[];
    automations: Automation[];
    webhooks: Webhook[];
    gateways: PaymentGateway[];
    activityLog: ActivityLog[];
    assets: Asset[];
}

type AppAction =
  | { type: 'ADD_CONTACT'; payload: Omit<Contact, 'id' | 'subscribedAt'> }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'BULK_ADD_TAGS'; payload: { contactIds: string[], tags: string[] } }
  | { type: 'BULK_DELETE_CONTACTS'; payload: { contactIds: string[] } }
  | { type: 'ADD_CAMPAIGN'; payload: Omit<Campaign, 'id' | 'recipients' | 'openRate' | 'status'> }
  | { type: 'UPDATE_CAMPAIGN'; payload: Campaign }
  | { type: 'RENAME_CAMPAIGN'; payload: { id: string, name: string } }
  | { type: 'DUPLICATE_CAMPAIGN'; payload: string }
  | { type: 'DELETE_CAMPAIGN'; payload: string }
  | { type: 'ADD_FUNNEL'; payload: { name: string } }
  | { type: 'DELETE_FUNNEL'; payload: string }
  | { type: 'UPDATE_FUNNEL'; payload: { id: string, name: string } }
  | { type: 'ADD_FUNNEL_STEP'; payload: { funnelId: string, stepData: Omit<FunnelStep, 'id'> } }
  | { type: 'DELETE_FUNNEL_STEP'; payload: { funnelId: string, stepId: string } }
  | { type: 'UPDATE_FUNNEL_STEP'; payload: { funnelId: string, step: FunnelStep } }
  | { type: 'ADD_AUTOMATION'; payload: { name: string } }
  | { type: 'UPDATE_AUTOMATION'; payload: Automation }
  | { type: 'RENAME_AUTOMATION'; payload: { id: string, name: string } }
  | { type: 'DELETE_AUTOMATION'; payload: string }
  | { type: 'TOGGLE_AUTOMATION_STATUS'; payload: string }
  | { type: 'ADD_WEBHOOK'; payload: Omit<Webhook, 'id' | 'lastTriggered'> }
  | { type: 'DELETE_WEBHOOK'; payload: string }
  | { type: 'TOGGLE_GATEWAY_CONNECTION'; payload: 'stripe' | 'paypal' } // Kept this for simple toggle, but will add more specific actions
  | { type: 'UPDATE_GATEWAY_CREDENTIALS'; payload: { id: 'stripe' | 'paypal', clientId: string, clientSecret: string } }
  | { type: 'SET_GATEWAY_CONNECTION_STATUS'; payload: { id: 'stripe' | 'paypal', isConnected: boolean } }
  | { type: 'ADD_ACTIVITY'; payload: Omit<ActivityLog, 'id' | 'timestamp'> }
  | { type: 'ADD_ASSET'; payload: Omit<Asset, 'id' | 'uploadedAt'> }
  | { type: 'UPDATE_ASSET'; payload: Asset }
  | { type: 'DELETE_ASSET'; payload: string };

const initialCampaignBody: EmailBlock[] = [
    {
        id: uuidv4(),
        type: 'header',
        props: {
            logoSrc: 'https://via.placeholder.com/150x50/0ea5e9/FFFFFF?text=FunnelFlow',
            logoAlt: 'Company Logo'
        }
    },
    {
        id: uuidv4(),
        type: 'text',
        props: {
            content: "<h1>Welcome to FunnelFlow!</h1><p>Hi {{contact.name}},</p><p>Welcome aboard! We're thrilled to have you. Over the next few days, we'll share some tips to get you started.</p>",
            textAlign: 'left',
            paddingX: 24,
            paddingY: 16
        }
    },
    {
        id: uuidv4(),
        type: 'button',
        props: {
            text: 'Get Started Now',
            href: '#',
            backgroundColor: '#0ea5e9', // sky-500
            textColor: '#ffffff',
            textAlign: 'center'
        }
    },
    {
        id: uuidv4(),
        type: 'spacer',
        props: {
            height: 20
        }
    }
];

const initialBlackFridayBody: EmailBlock[] = [
    {
        id: uuidv4(),
        type: 'image',
        props: {
            src: 'https://via.placeholder.com/600x300/1e293b/FFFFFF?text=BLACK+FRIDAY',
            alt: 'Black Friday Sale Banner'
        }
    },
    {
        id: uuidv4(),
        type: 'text',
        props: {
            content: "<h2>Don't miss out on our biggest sale ever!</h2><p>Get up to <strong>50% off</strong> on all products. Sale ends this Friday.</p>",
            textAlign: 'center',
            paddingX: 24,
            paddingY: 16
        }
    },
     {
        id: uuidv4(),
        type: 'button',
        props: {
            text: 'Shop Now & Save BIG',
            href: '#',
            backgroundColor: '#ef4444', // red-500
            textColor: '#ffffff',
            textAlign: 'center'
        }
    }
];

const initialDraftBody: EmailBlock[] = [
    {
        id: uuidv4(),
        type: 'text',
        props: {
            content: "<h2>Here's what we've been up to this quarter...</h2><p>Start editing this draft to create your awesome newsletter!</p>",
            paddingX: 24,
            paddingY: 16
        }
    }
];

const initialState: AppState = {
    contacts: [
        { id: '1', name: 'John Doe', email: 'john.doe@example.com', tags: ['lead', 'newsletter'], subscribedAt: '2023-10-26' },
        { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', tags: ['customer', 'vip'], subscribedAt: '2023-10-25' },
    ],
    campaigns: [
        { id: 'c1', name: 'Welcome Series', subject: 'Welcome to FunnelFlow!', body: initialCampaignBody, status: 'sent', recipients: 1500, openRate: 25.5, style: { contentBackgroundColor: '#ffffff', bodyBackgroundColor: '#f1f5f9' } },
        { id: 'c2', name: 'Black Friday Sale', subject: 'Biggest Sale of the Year!', body: initialBlackFridayBody, status: 'scheduled', recipients: 5000, openRate: 0, style: { contentBackgroundColor: '#ffffff', bodyBackgroundColor: '#f1f5f9' } },
        { id: 'c3', name: 'Q4 Newsletter', subject: 'News and Updates for Q4', body: initialDraftBody, status: 'draft', recipients: 0, openRate: 0, style: { contentBackgroundColor: '#ffffff', bodyBackgroundColor: '#f1f5f9' } },
        { id: 'c4', name: 'VIP Welcome', subject: 'A Special Welcome for our VIPs', body: initialCampaignBody.map(b => ({...b, id: uuidv4()})), status: 'draft', recipients: 0, openRate: 0, style: { contentBackgroundColor: '#ffffff', bodyBackgroundColor: '#f1f5f9' } },
    ],
    funnels: [
        { id: 'f1', name: 'Lead Magnet Funnel', isActive: true, steps: [
            { id: 's1', name: 'Opt-in Page', type: 'page', pageType: 'squeeze', body: [{ id: uuidv4(), type: 'text', props: { content: '<h1>Download Our Free E-Book!</h1><p>Enter your email below to get your free guide delivered to your inbox.</p>' } }], style: { contentBackgroundColor: '#ffffff', bodyBackgroundColor: '#f1f5f9' } },
            { id: 's2', name: 'Thank You Page', type: 'page', pageType: 'thankyou', body: [{ id: uuidv4(), type: 'text', props: { content: "<h1>Thanks! Your e-book is on its way.</h1><p>Please check your email. It should arrive in the next 5 minutes.</p>" } }], style: { contentBackgroundColor: '#ffffff', bodyBackgroundColor: '#f1f5f9' } },
        ]},
        { id: 'f2', name: 'Webinar Funnel', isActive: false, steps: []},
    ],
    automations: [
        { 
            id: 'a1', 
            name: 'New Subscriber Welcome Sequence', 
            isActive: true,
            nodes: [
                { id: 'n1', type: 'trigger', data: { label: 'Contact Subscribed', triggerType: 'contactSubscribed' }, position: { x: 50, y: 200 } },
                { id: 'n2', type: 'condition', data: { label: 'Has VIP Tag?', conditionType: 'hasTag', conditionTag: 'vip' }, position: { x: 300, y: 200 } },
                { id: 'n3', type: 'action', data: { label: 'Send VIP Welcome', actionType: 'sendEmail', campaignId: 'c4' }, position: { x: 550, y: 100 } },
                { id: 'n4', type: 'action', data: { label: 'Send Standard Welcome', actionType: 'sendEmail', campaignId: 'c1' }, position: { x: 550, y: 300 } },
                { id: 'n5', type: 'action', data: { label: 'Add "Newsletter" Tag', actionType: 'addTag', tagName: 'newsletter' }, position: { x: 800, y: 300 } },
            ],
            edges: [
                { id: 'e1-2', source: 'n1', target: 'n2', sourceHandle: 'default' },
                { id: 'e2-3', source: 'n2', target: 'n3', sourceHandle: 'yes' },
                { id: 'e2-4', source: 'n2', target: 'n4', sourceHandle: 'no' },
                { id: 'e4-5', source: 'n4', target: 'n5', sourceHandle: 'default'},
            ],
            annotations: [
                {
                    id: 'anno1',
                    label: 'Welcome Sequence Logic',
                    position: { x: 275, y: 50 },
                    size: { width: 575, height: 350 }
                }
            ]
        },
        {
            id: 'a2',
            name: 'Abandoned Cart Nudge',
            isActive: false,
            nodes: [
                { id: 'n1', type: 'trigger', data: { label: 'Funnel Exit - Cart', triggerType: 'funnelExit', triggerFunnelId: 'f1', triggerFunnelStepId: 's1' }, position: { x: 50, y: 200 } },
                { id: 'n2', type: 'delay', data: { label: 'Wait 1 Hour', durationValue: 1, durationUnit: 'hours' }, position: { x: 300, y: 200 } },
                { id: 'n3', type: 'action', data: { label: 'Send Cart Reminder', actionType: 'sendEmail', campaignId: 'c2' }, position: { x: 550, y: 200 } },
            ],
            edges: [
                { id: 'e1-2', source: 'n1', target: 'n2', sourceHandle: 'default' },
                { id: 'e2-3', source: 'n2', target: 'n3', sourceHandle: 'default' },
            ],
            annotations: [],
        },
        {
            id: 'a3',
            name: 'Engaged Lead Follow-up',
            isActive: true,
            nodes: [
                { id: 'n1', type: 'trigger', data: { label: 'Campaign Clicked: BF Sale', triggerType: 'campaignClicked', triggerCampaignId: 'c2' }, position: { x: 50, y: 200 } },
                { id: 'n2', type: 'delay', data: { label: 'Wait 30 Mins', durationValue: 30, durationUnit: 'minutes' }, position: { x: 300, y: 200 } },
                { id: 'n3', type: 'action', data: { label: 'Add "Hot Prospect" Tag', actionType: 'addTag', tagName: 'hot-prospect' }, position: { x: 550, y: 200 } },
            ],
            edges: [
                { id: 'e1-2', source: 'n1', target: 'n2', sourceHandle: 'default' },
                { id: 'e2-3', source: 'n2', target: 'n3', sourceHandle: 'default' },
            ],
            annotations: [],
        }
    ],
    webhooks: [
        { id: 'w1', url: 'https://api.example.com/hooks/new-contact', event: 'contact.created', lastTriggered: null }
    ],
    gateways: [
        { id: 'stripe', name: 'Stripe', isConnected: false, clientId: '', clientSecret: '' },
        { id: 'paypal', name: 'PayPal', isConnected: false, clientId: '', clientSecret: '' },
    ],
    activityLog: ([
        { id: 'ac1', type: 'CAMPAIGN', description: 'Campaign "Welcome Series" was sent.', timestamp: new Date().toISOString() },
        { id: 'ac2', type: 'CONTACT', description: 'New contact Jane Smith was added.', timestamp: new Date().toISOString() },
    ] as ActivityLog[]).reverse(),
    assets: [
        { id: 'asset1', name: 'Company Logo Dark.png', type: 'image', url: 'https://via.placeholder.com/150x50/1e293b/FFFFFF?text=Logo', uploadedAt: new Date().toLocaleDateString(), status: 'system' },
        { id: 'asset2', name: 'Product Brochure.pdf', type: 'pdf', url: '#', uploadedAt: new Date().toLocaleDateString(), status: 'free' },
        { id: 'asset3', name: 'Header Image.jpg', type: 'image', url: 'https://via.placeholder.com/600x300/e2e8f0/64748b?text=Header+Image', uploadedAt: new Date().toLocaleDateString(), status: 'free' },
        { id: 'asset4', name: 'Premium Video Course.mp4', type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', uploadedAt: new Date().toLocaleDateString(), status: 'paid' },
        { id: 'asset5', name: 'Monthly Newsletter Template.zip', type: 'newsletter', url: '#', uploadedAt: new Date().toLocaleDateString(), status: 'system' },
        { id: 'asset6', name: 'Intro to Funnels.pdf', type: 'drip_content', url: '#', uploadedAt: new Date().toLocaleDateString(), status: 'free' },
        { id: 'asset7', name: 'Best Selling E-Book.epub', type: 'book', url: '#', uploadedAt: new Date().toLocaleDateString(), status: 'paid' },
    ]
};

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'ADD_CONTACT': {
            const newContact: Contact = {
                id: uuidv4(),
                ...action.payload,
                subscribedAt: new Date().toLocaleDateString(),
            };
            return { ...state, contacts: [newContact, ...state.contacts] };
        }
        case 'UPDATE_CONTACT':
            return {
                ...state,
                contacts: state.contacts.map(c => c.id === action.payload.id ? action.payload : c)
            };
        case 'DELETE_CONTACT':
            return { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) };

        case 'BULK_ADD_TAGS': {
            const { contactIds, tags } = action.payload;
            return {
                ...state,
                contacts: state.contacts.map(contact => {
                    if (contactIds.includes(contact.id)) {
                        const newTags = new Set(contact.tags);
                        tags.forEach(tag => newTags.add(tag));
                        return { ...contact, tags: Array.from(newTags) };
                    }
                    return contact;
                })
            };
        }
        case 'BULK_DELETE_CONTACTS': {
            const { contactIds } = action.payload;
            return {
                ...state,
                contacts: state.contacts.filter(contact => !contactIds.includes(contact.id))
            };
        }

        case 'ADD_CAMPAIGN': {
            const newCampaign: Campaign = {
                id: uuidv4(),
                ...action.payload,
                recipients: 0,
                openRate: 0,
                status: 'draft',
            };
            return { ...state, campaigns: [newCampaign, ...state.campaigns] };
        }
        case 'UPDATE_CAMPAIGN':
            return {
                ...state,
                campaigns: state.campaigns.map(c => c.id === action.payload.id ? action.payload : c)
            };
        case 'RENAME_CAMPAIGN':
            return {
                ...state,
                campaigns: state.campaigns.map(c => c.id === action.payload.id ? { ...c, name: action.payload.name } : c)
            };
        case 'DUPLICATE_CAMPAIGN': {
            const original = state.campaigns.find(c => c.id === action.payload);
            if (!original) return state;
            const newCampaign: Campaign = {
                ...original,
                body: original.body.map(b => ({ ...b, id: uuidv4()})),
                id: uuidv4(),
                name: `Copy of ${original.name}`,
                status: 'draft',
                recipients: 0,
                openRate: 0,
            };
            return { ...state, campaigns: [newCampaign, ...state.campaigns] };
        }
        case 'DELETE_CAMPAIGN':
            return { ...state, campaigns: state.campaigns.filter(c => c.id !== action.payload) };

        case 'ADD_FUNNEL': {
            const newFunnel: Funnel = {
                id: uuidv4(),
                name: action.payload.name,
                isActive: true,
                steps: [],
            };
            return { ...state, funnels: [...state.funnels, newFunnel] };
        }
        case 'DELETE_FUNNEL':
            return { ...state, funnels: state.funnels.filter(f => f.id !== action.payload) };

        case 'UPDATE_FUNNEL':
            return {
                ...state,
                funnels: state.funnels.map(f => f.id === action.payload.id ? { ...f, name: action.payload.name } : f)
            };
        
        case 'ADD_FUNNEL_STEP': {
            const newStep: FunnelStep = {
                id: uuidv4(),
                ...action.payload.stepData
            };
            return {
                ...state,
                funnels: state.funnels.map(f =>
                    f.id === action.payload.funnelId
                        ? { ...f, steps: [...f.steps, newStep] }
                        : f
                )
            };
        }
        case 'DELETE_FUNNEL_STEP': {
            return {
                ...state,
                funnels: state.funnels.map(f =>
                    f.id === action.payload.funnelId
                        ? { ...f, steps: f.steps.filter(s => s.id !== action.payload.stepId) }
                        : f
                )
            };
        }
        case 'UPDATE_FUNNEL_STEP': {
            return {
                ...state,
                funnels: state.funnels.map(f => 
                    f.id === action.payload.funnelId
                        ? { ...f, steps: f.steps.map(s => s.id === action.payload.step.id ? action.payload.step : s) }
                        : f
                )
            }
        }
            
        case 'ADD_AUTOMATION': {
            const newAutomation: Automation = {
                id: uuidv4(),
                name: action.payload.name,
                isActive: false,
                nodes: [
                    { id: 'start', type: 'trigger', data: { label: 'Contact Subscribed', triggerType: 'contactSubscribed' }, position: { x: 50, y: 150 } }
                ],
                edges: [],
                annotations: [],
            };
            return { ...state, automations: [...state.automations, newAutomation] };
        }
        case 'UPDATE_AUTOMATION':
            return {
                ...state,
                automations: state.automations.map(a => a.id === action.payload.id ? action.payload : a)
            };
        case 'RENAME_AUTOMATION':
            return {
                ...state,
                automations: state.automations.map(a => a.id === action.payload.id ? { ...a, name: action.payload.name } : a)
            };
        case 'DELETE_AUTOMATION':
            return { ...state, automations: state.automations.filter(a => a.id !== action.payload) };

        case 'TOGGLE_AUTOMATION_STATUS':
             return {
                ...state,
                automations: state.automations.map(a => a.id === action.payload ? { ...a, isActive: !a.isActive } : a)
            };

        case 'ADD_WEBHOOK': {
            const newWebhook: Webhook = {
                id: uuidv4(),
                ...action.payload,
                lastTriggered: null
            };
            return { ...state, webhooks: [newWebhook, ...state.webhooks] };
        }
        case 'DELETE_WEBHOOK':
            return { ...state, webhooks: state.webhooks.filter(w => w.id !== action.payload) };
            
        case 'TOGGLE_GATEWAY_CONNECTION': // This action might become less relevant if replaced by SET_GATEWAY_CONNECTION_STATUS
            return {
                ...state,
                gateways: state.gateways.map(g =>
                    g.id === action.payload ? { ...g, isConnected: !g.isConnected } : g
                ),
            };
        case 'UPDATE_GATEWAY_CREDENTIALS':
            return {
                ...state,
                gateways: state.gateways.map(g =>
                    g.id === action.payload.id ? { ...g, clientId: action.payload.clientId, clientSecret: action.payload.clientSecret } : g
                ),
            };
        case 'SET_GATEWAY_CONNECTION_STATUS':
            return {
                ...state,
                gateways: state.gateways.map(g =>
                    g.id === action.payload.id ? { ...g, isConnected: action.payload.isConnected } : g
                ),
            };

        case 'ADD_ACTIVITY': {
            const newActivity: ActivityLog = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                ...action.payload
            };
            return { ...state, activityLog: [newActivity, ...state.activityLog] };
        }

        case 'ADD_ASSET': {
            const newAsset: Asset = {
                id: uuidv4(),
                ...action.payload,
                uploadedAt: new Date().toLocaleDateString(),
            };
            return { ...state, assets: [newAsset, ...state.assets] };
        }
        case 'UPDATE_ASSET':
            return {
                ...state,
                assets: state.assets.map(a => a.id === action.payload.id ? action.payload : a)
            };
        case 'DELETE_ASSET':
            return { ...state, assets: state.assets.filter(a => a.id !== action.payload) };


        default:
            return state;
    }
};

interface AppContextProps {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextProps>({
    state: initialState,
    dispatch: () => null,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);