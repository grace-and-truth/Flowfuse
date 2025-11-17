import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { FunnelStep, PageType, Template, EmailBlock } from '../../types';
import { useAppContext } from '../../AppContext';
import { pageTypes } from './AddFunnelStepModal'; 
import { funnelTemplates } from './templates';
import TemplateIcon from '../../components/icons/TemplateIcon';
import VisualEmailEditor from '../campaigns/components/VisualEmailEditor';
import PreviewEmailModal from '../campaigns/PreviewEmailModal';
import { generateEmailCopy } from '../../services/geminiService';
import SparklesIcon from '../../components/icons/SparklesIcon';
import EyeIcon from '../../components/icons/EyeIcon';
import { v4 as uuidv4 } from 'uuid';

interface EditFunnelStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: FunnelStep;
  funnelId: string;
  onPreviewTemplate: (template: Template) => void;
}

const EditFunnelStepModal: React.FC<EditFunnelStepModalProps> = ({ isOpen, onClose, step, funnelId, onPreviewTemplate }) => {
  const { dispatch } = useAppContext();
  
  const [name, setName] = useState('');
  const [pageType, setPageType] = useState<PageType>('custom');
  const [body, setBody] = useState<EmailBlock[]>([]);
  const [style, setStyle] = useState<FunnelStep['style']>({ bodyBackgroundColor: '#f1f5f9', contentBackgroundColor: '#ffffff' });
  const [duration, setDuration] = useState('');
  const [viewMode, setViewMode] = useState<'form' | 'templates'>('form');
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    if (step) {
        setName(step.name);
        setDuration(step.duration || '');
        setBody(step.body || []);
        setStyle(step.style || { bodyBackgroundColor: '#f1f5f9', contentBackgroundColor: '#ffffff' });

        if (step.type === 'page') {
            setPageType(step.pageType || 'custom');
        }
        
        if (!step.body?.length && (step.type === 'page' || step.type === 'email')) {
            setViewMode('templates');
        } else {
            setViewMode('form');
        }
    }
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (step.type === 'delay' && !duration)) return;

    const updatedStep: FunnelStep = { 
        ...step, 
        name,
        pageType: step.type === 'page' ? pageType : undefined,
        body: (step.type === 'page' || step.type === 'email') ? body : undefined,
        style: (step.type === 'page' || step.type === 'email') ? style : undefined,
        duration: step.type === 'delay' ? duration : undefined,
    };

    dispatch({ type: 'UPDATE_FUNNEL_STEP', payload: { funnelId, step: updatedStep } });
    onClose();
  };
  
  const handleApplyTemplate = (template: Template) => {
      setName(template.name);
      setBody(template.blocks.map(b => ({ ...b, id: uuidv4() })));
      setStyle(template.style || { bodyBackgroundColor: '#f1f5f9', contentBackgroundColor: '#ffffff' });
      setViewMode('form');
  };

  const handleGenerate = async () => {
      if (!prompt) return;
      setIsGenerating(true);
      const result = await generateEmailCopy(prompt);
      
      const newBlock: EmailBlock = {
          id: uuidv4(),
          type: 'text',
          props: { content: result.body }
      };
      setBody(currentBody => [...currentBody, newBlock]);
      
      setIsGenerating(false);
      setPrompt('');
  };

  const renderDelayForm = () => (
     <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Step Name" required className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
        <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g., 1 day, 6 hours" required className="w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
            <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">Save Changes</button>
        </div>
    </form>
  );

  const templates = step.type === 'page' ? funnelTemplates[pageType] : step.type === 'email' ? funnelTemplates.email : [];

  const renderVisualEditor = () => (
     <div className="flex flex-col h-full bg-slate-800">
        <div className="p-4 border-b border-slate-700 space-y-4">
            <div className="flex items-center space-x-4">
                <input type="text" placeholder="Step Name" value={name} onChange={(e) => setName(e.target.value)} required className="flex-1 p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"/>
                {step.type === 'page' && (
                    <select 
                        value={pageType} 
                        onChange={e => setPageType(e.target.value as PageType)}
                        className="p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        {pageTypes.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
                    </select>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe content to add with AI..."
                    className="flex-1 p-2 bg-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="flex items-center bg-sky-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-5 h-5 mr-2"/>
                    <span>{isGenerating ? 'Adding...' : 'Add'}</span>
                </button>
            </div>
        </div>

        <VisualEmailEditor blocks={body} onBlocksChange={setBody} style={style} onStyleChange={setStyle} />

        <div className="p-4 border-t border-slate-700 flex justify-between items-center">
            <button onClick={() => setViewMode('templates')} className="flex items-center text-slate-300 font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                <TemplateIcon className="w-5 h-5 mr-2" />
                Change Template
            </button>
            <div className="flex items-center space-x-2">
                <button onClick={() => setIsPreviewing(true)} className="flex items-center text-slate-300 font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                    <EyeIcon className="w-5 h-5 mr-2"/>
                    Preview
                </button>
                <button onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                <button onClick={handleSubmit} className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">Save Changes</button>
            </div>
        </div>
    </div>
  );


  const renderTemplateView = () => (
    <div className="p-6">
        <h3 className="text-xl font-semibold text-white text-center">Choose a Starting Point</h3>
        <p className="text-slate-400 text-center mb-6">Select a template or start from a blank slate.</p>
        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {templates.map(template => (
                <div key={template.id} className="bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-slate-300">{template.name}</span>
                    <div className="space-x-2">
                        <button onClick={() => onPreviewTemplate(template)} className="text-sm text-sky-400 hover:text-sky-300">Preview</button>
                        <button onClick={() => handleApplyTemplate(template)} className="text-sm bg-sky-500 text-white px-3 py-1 rounded-md hover:bg-sky-600">Apply</button>
                    </div>
                </div>
            ))}
        </div>
        <div className="text-center mt-6">
            <button onClick={() => setViewMode('form')} className="text-slate-400 hover:text-white underline">
                or start from scratch
            </button>
        </div>
    </div>
  );

  const isVisualStep = step.type === 'page' || step.type === 'email';
  let content;
  if (!isVisualStep) {
    content = renderDelayForm();
  } else if (viewMode === 'templates') {
    content = renderTemplateView();
  } else {
    content = renderVisualEditor();
  }

  return (
    <>
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={viewMode === 'templates' ? `Select Template for: ${step.name}` : `Edit Step: ${step.name}`}
            size={isVisualStep && viewMode === 'form' ? 'large' : 'default'}
        >
            {content}
        </Modal>
        {isPreviewing && isVisualStep && (
            <PreviewEmailModal 
                isOpen={isPreviewing} 
                onClose={() => setIsPreviewing(false)} 
                subject={step.type === 'email' ? 'Email Preview' : 'Page Preview'} 
                blocks={body}
                style={style}
            />
        )}
    </>
  );
};

export default EditFunnelStepModal;