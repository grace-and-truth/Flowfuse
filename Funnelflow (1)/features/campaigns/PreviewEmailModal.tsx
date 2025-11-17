import React, { useState, useMemo } from 'react';
import Modal from '../../components/Modal';
import { EmailBlock, Campaign } from '../../types';
import { renderEmailHtml } from './util/emailRenderer';

interface PreviewEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  blocks: EmailBlock[];
  style: Campaign['style'];
}

const PreviewEmailModal: React.FC<PreviewEmailModalProps> = ({ isOpen, onClose, subject, blocks, style }) => {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  const emailHtml = useMemo(() => renderEmailHtml(blocks, subject, style), [blocks, subject, style]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Preview">
      <div className="bg-slate-700 p-2 rounded-t-lg">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex justify-center flex-1">
                 <div className="bg-slate-600 p-1 rounded-lg flex space-x-1">
                    <button onClick={() => setView('desktop')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Desktop</button>
                    <button onClick={() => setView('mobile')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Mobile</button>
                </div>
            </div>
            <div className="w-20"></div>
        </div>
        <div className="bg-slate-600 rounded p-2 text-sm text-slate-300">
            <span className="font-semibold text-white">Subject: </span>{subject}
        </div>
      </div>
      <div className="bg-slate-900 p-4 h-[65vh] overflow-y-auto">
        <iframe
          srcDoc={emailHtml}
          title="Email Preview"
          className={`mx-auto bg-white shadow-xl transition-all duration-300 ${view === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[667px]'}`}
          sandbox="allow-scripts"
        />
      </div>
    </Modal>
  );
};

export default PreviewEmailModal;
