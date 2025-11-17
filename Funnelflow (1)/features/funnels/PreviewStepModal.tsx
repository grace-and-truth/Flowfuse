import React, { useMemo } from 'react';
import Modal from '../../components/Modal';
import { FunnelStep, Template } from '../../types';
import { renderEmailHtml } from '../campaigns/util/emailRenderer';

interface PreviewStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FunnelStep | Template | null; 
}

const PreviewStepModal: React.FC<PreviewStepModalProps> = ({ isOpen, onClose, item }) => {
  const emailHtml = useMemo(() => {
    if (!item) return '';
    
    const title = "name" in item ? item.name : 'Preview';
    const blocks = ("body" in item && item.body) ? item.body : ("blocks" in item && item.blocks) ? item.blocks : [];
    const style = "style" in item ? item.style : undefined;

    if (blocks.length === 0) {
        return '<html><body style="font-family: sans-serif; color: #94a3b8; text-align: center; padding: 4rem;">No content to preview.</body></html>';
    }
    
    return renderEmailHtml(blocks, title, style);
  }, [item]);

  if (!item) return null;

  const title = "name" in item ? item.name : 'Preview';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Preview: ${title}`} size="large">
        <div className="bg-slate-900 p-4 h-[75vh] overflow-y-auto">
             <iframe
                srcDoc={emailHtml}
                title="Content Preview"
                className={`mx-auto bg-white shadow-xl w-full h-full`}
                sandbox="allow-scripts"
            />
        </div>
    </Modal>
  );
};

export default PreviewStepModal;