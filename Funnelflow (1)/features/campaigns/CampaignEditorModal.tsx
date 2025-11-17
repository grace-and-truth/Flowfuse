import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Campaign, EmailBlock, EmailTemplate } from '../../types';
import SparklesIcon from '../../components/icons/SparklesIcon';
import EyeIcon from '../../components/icons/EyeIcon';
import TemplateIcon from '../../components/icons/TemplateIcon';
import FullscreenIcon from '../../components/icons/FullscreenIcon';
import { generateEmailCopy } from '../../services/geminiService';
import { useAppContext } from '../../AppContext';
import { v4 as uuidv4 } from 'uuid';
import VisualEmailEditor from './components/VisualEmailEditor';
import PreviewEmailModal from './PreviewEmailModal';
import { emailTemplates } from './emailTemplates';

interface CampaignEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign | null;
}

const TemplateSelector: React.FC<{ onSelect: (template: EmailTemplate) => void }> = ({ onSelect }) => {
    return (
        <div className="h-[60vh] flex flex-col p-6">
            <h2 className="text-2xl font-bold text-center text-white mb-2">Start with a Template</h2>
            <p className="text-center text-slate-400 mb-6">Choose a pre-designed layout to get started quickly.</p>
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                {emailTemplates.map(template => (
                    <div key={template.id} onClick={() => onSelect(template)} className="cursor-pointer group">
                        <div className="bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-700 group-hover:border-sky-500 transition-all">
                            <div className="h-40 bg-slate-600 flex items-center justify-center">
                                <TemplateIcon className="w-12 h-12 text-slate-500"/>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-white">{template.name}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};


const CampaignEditorModal: React.FC<CampaignEditorModalProps> = ({ isOpen, onClose, campaign }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState<EmailBlock[]>([]);
    const [style, setStyle] = useState<Campaign['style']>({ bodyBackgroundColor: '#f1f5f9', contentBackgroundColor: '#ffffff' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [view, setView] = useState<'editor' | 'templates'>('editor');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const isEditing = campaign !== null;

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setName(campaign.name);
                setSubject(campaign.subject);
                setBody(campaign.body);
                setStyle(campaign.style || { bodyBackgroundColor: '#f1f5f9', contentBackgroundColor: '#ffffff' });
                setView('editor');
            } else {
                setView('templates');
            }
        } else {
             // Reset state on close
            setIsFullscreen(false);
            setName('');
            setSubject('');
            setBody([]);
        }
    }, [campaign, isEditing, isOpen]);
    
    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        const result = await generateEmailCopy(prompt);
        if (!isEditing && !subject) {
            setSubject(result.subject);
        }
        
        const newBlock: EmailBlock = {
            id: uuidv4(),
            type: 'text',
            props: { content: result.body }
        };
        setBody(currentBody => [...currentBody, newBlock]);
        
        setIsGenerating(false);
        setPrompt('');
    };

    const handleSave = () => {
        if (!name || !subject || body.length === 0) return;

        const payload = { name, subject, body, style };

        if (isEditing) {
            dispatch({
                type: 'UPDATE_CAMPAIGN',
                payload: { ...campaign, ...payload }
            });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'CAMPAIGN', description: `Campaign '${name}' was updated.`}
            });
        } else {
            dispatch({
                type: 'ADD_CAMPAIGN',
                payload: payload
            });
            dispatch({
                type: 'ADD_ACTIVITY',
                payload: { type: 'CAMPAIGN', description: `Draft campaign '${name}' created.`}
            });
        }
        onClose();
    };
    
    const handleSelectTemplate = (template: EmailTemplate) => {
        setName(template.name);
        setSubject(`Your Subject for: ${template.name}`);
        setBody(template.blocks.map(b => ({...b, id: uuidv4()})));
        setStyle(template.style || { bodyBackgroundColor: '#f1f5f9', contentBackgroundColor: '#ffffff' });
        setView('editor');
    };

    const EditorView = () => (
         <div className="flex flex-col h-full bg-slate-800">
            <div className="p-4 border-b border-slate-700 space-y-4">
                 <div className="flex items-center space-x-4">
                    <input type="text" placeholder="Campaign Name" value={name} onChange={(e) => setName(e.target.value)} required className="flex-1 p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"/>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email Subject" required className="flex-1 p-2 bg-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                 <div className="flex items-center space-x-2">
                    <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe content to add (e.g., 'a paragraph about our new loyalty program')"
                        className="flex-1 p-2 bg-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className="flex items-center bg-sky-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2"/>
                        <span>{isGenerating ? 'Adding...' : 'Add with AI'}</span>
                    </button>
                </div>
            </div>
            <VisualEmailEditor blocks={body} onBlocksChange={setBody} style={style} onStyleChange={setStyle} />
            <div className="p-4 border-t border-slate-700 flex justify-between items-center">
                 <div className="flex items-center space-x-2">
                    <button onClick={() => setIsPreviewing(true)} className="flex items-center text-slate-300 font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                        <EyeIcon className="w-5 h-5 mr-2"/>
                        Preview
                    </button>
                     <button onClick={() => setIsFullscreen(!isFullscreen)} className="flex items-center text-slate-300 font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                        <FullscreenIcon className="w-5 h-5 mr-2"/>
                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                </div>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                    <button onClick={handleSave} className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">
                        {isEditing ? 'Save Changes' : 'Save Campaign'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={view === 'templates' ? 'Create New Campaign' : (isEditing ? 'Edit Campaign' : 'Create New Campaign')}
                size={view === 'editor' ? (isFullscreen ? 'fullscreen' : 'large') : 'large'}
            >
                {view === 'templates' ? <TemplateSelector onSelect={handleSelectTemplate} /> : <EditorView />}
            </Modal>

            {isPreviewing && <PreviewEmailModal isOpen={isPreviewing} onClose={() => setIsPreviewing(false)} subject={subject} blocks={body} style={style}/>}
        </>
    );
};

export default CampaignEditorModal;
