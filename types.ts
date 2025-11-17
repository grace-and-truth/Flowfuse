import { ReactNode } from "react";

export type View = 'dashboard' | 'funnels' | 'contacts' | 'automations' | 'campaigns' | 'webhooks' | 'settings' | 'assets';

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'document' | 'book' | 'course' | 'newsletter' | 'drip_content' | 'other';
  url: string;
  uploadedAt: string;
  status: 'free' | 'paid' | 'system';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  tags: string[];
  subscribedAt: string;
}

export interface FormField {
    id: string;
    type: 'text' | 'email' | 'textarea' | 'checkbox';
    label: string;
    placeholder?: string;
    required: boolean;
}

// New types for the visual email editor
export type EmailBlockType = 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'header' | 'shape' | 'form';

export interface EmailBlock {
  id: string;
  type: EmailBlockType;
  props: {
    // text
    content?: string;
    // image
    src?: string;
    alt?: string;
    // button
    text?: string;
    href?: string;
    // spacer
    height?: number;
    // divider
    color?: string;
    // header
    logoSrc?: string;
    logoAlt?: string;
    // shape
    shapeType?: 'rectangle' | 'circle' | 'triangle-up' | 'triangle-down' | 'star';
    width?: number; // px for shapes
    rotation?: number; // degrees
    // shape text overlay
    shapeText?: string;
    shapeTextColor?: string;
    shapeFontSize?: number;
    // form
    formFields?: FormField[];
    submitButtonText?: string;
    successMessage?: string;
    formStyle?: 'simple' | 'modern';
    formActionType?: 'showMessage' | 'redirect' | 'nextStep' | 'addTags';
    formActionData?: {
        redirectUrl?: string;
        tags?: string; // comma-separated
    };
    // general styling
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    paddingX?: number;
    paddingY?: number;
    backgroundColor?: string;
    textColor?: string;
  };
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: EmailBlock[];
  status: 'draft' | 'sent' | 'scheduled';
  recipients: number;
  openRate: number;
  // General email style settings
  style?: {
      bodyBackgroundColor?: string;
      contentBackgroundColor?: string;
  }
}

export type PageType = 'squeeze' | 'sales' | 'order' | 'upsell' | 'downsell' | 'thankyou' | 'custom' | 'membership' | 'optout';
export type FunnelStepType = 'page' | 'email' | 'delay';

export interface FunnelStep {
    id: string;
    name: string;
    type: FunnelStepType;
    pageType?: PageType;
    body?: EmailBlock[];
    style?: Campaign['style'];
    duration?: string; // e.g., "1 day", "6 hours"
}

export interface Funnel {
  id: string;
  name: string;
  isActive: boolean;
  steps: FunnelStep[];
}

// New types for the visual automation editor
export type AutomationNodeType = 'trigger' | 'action' | 'delay' | 'condition';

export interface AutomationAnnotation {
    id: string;
    label: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
}

export interface AutomationNodeData {
    label: string;
    // Action specific data
    actionType?: 'sendEmail' | 'addTag';
    campaignId?: string; // for sendEmail
    targetTags?: string; // for sendEmail, comma separated
    tagName?: string; // for addTag
    // Delay specific data
    durationValue?: number;
    durationUnit?: 'minutes' | 'hours' | 'days';
    // Trigger specific data
    triggerType?: 'contactSubscribed' | 'campaignOpened' | 'campaignClicked' | 'funnelStepViewed' | 'funnelPurchaseSuccess' | 'funnelExit';
    // Condition specific data
    conditionType?: 'hasTag' | 'openedCampaign' | 'clickedCampaignLink' | 'viewedFunnelStep' | 'madeFunnelPurchase';

    // Shared properties for triggers/conditions
    triggerCampaignId?: string;
    triggerFunnelId?: string;
    triggerFunnelStepId?: string;
    triggerTargetLinkUrl?: string;
    triggerTargetButtonText?: string;

    conditionCampaignId?: string;
    conditionFunnelId?: string;
    conditionFunnelStepId?: string;
    conditionTargetLinkUrl?: string;
    conditionTargetButtonText?: string;

    conditionTag?: string; // existing for hasTag
}

export interface AutomationNode {
    id: string;
    type: AutomationNodeType;
    data: AutomationNodeData;
    position: { x: number; y: number };
}

export interface AutomationEdge {
    id: string;
    source: string; // source node id
    target: string; // target node id
    sourceHandle?: 'yes' | 'no' | 'default'; // For conditions or single-output nodes
}

export interface Automation {
    id: string;
    name: string;
    isActive: boolean;
    nodes: AutomationNode[];
    edges: AutomationEdge[];
    annotations?: AutomationAnnotation[];
}

export interface Webhook {
    id: string;
    url: string;
    event: string;
    lastTriggered: string | null;
}

export interface PaymentGateway {
    id: 'stripe' | 'paypal';
    name: string;
    isConnected: boolean;
    clientId: string; // Added for simulated integration
    clientSecret: string; // Added for simulated integration
}

export interface ActivityLog {
    id: string;
    type: 'CONTACT' | 'CAMPAIGN' | 'FUNNEL' | 'SYSTEM' | 'AUTOMATION' | 'ASSET';
    description: string;
    timestamp: string;
}

export interface Template {
    id: string;
    name: string;
    blocks: EmailBlock[];
    style?: Campaign['style'];
}

export interface EmailTemplate {
    id: string;
    name: string;
    blocks: EmailBlock[];
    style: Campaign['style'];
}