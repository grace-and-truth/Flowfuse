import React, { useState } from 'react';
import AssetPickerModal from './AssetPickerModal';

interface LinkInputProps {
    href: string | undefined;
    onHrefChange: (href: string) => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ href, onHrefChange }) => {
    const [isAssetPickerOpen, setAssetPickerOpen] = useState(false);

    const handleAssetSelect = (url: string) => {
        onHrefChange(url);
    };

    return (
        <>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={href || ''}
                    onChange={e => onHrefChange(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 w-full p-2 bg-slate-700 rounded-md text-white focus:outline-none"
                />
                <button
                    type="button"
                    onClick={() => setAssetPickerOpen(true)}
                    className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-md text-sm font-semibold"
                >
                    Browse
                </button>
            </div>
            <AssetPickerModal
                isOpen={isAssetPickerOpen}
                onClose={() => setAssetPickerOpen(false)}
                onSelect={handleAssetSelect}
            />
        </>
    );
};

export default LinkInput;
