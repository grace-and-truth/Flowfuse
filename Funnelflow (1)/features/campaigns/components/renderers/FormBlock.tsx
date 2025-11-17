import React from 'react';
import { EmailBlock, FormField } from '../../../../types';

interface FormBlockProps {
    block: EmailBlock;
    isSelected: boolean;
}

const FormBlock: React.FC<FormBlockProps> = ({ block }) => {
    const { formFields = [], submitButtonText = 'Submit', formStyle = 'simple', paddingX = 24, paddingY = 24 } = block.props;

    const renderField = (field: FormField) => {
        const baseInputClasses = "w-full pointer-events-none text-slate-800 placeholder-slate-400";
        let styleClasses = '';
        if (formStyle === 'simple') {
            styleClasses = 'p-2 border border-slate-300 rounded-md bg-slate-100';
        } else { // modern
            styleClasses = 'p-2 border-b-2 border-slate-400 bg-transparent';
        }

        if (field.type === 'checkbox') {
            return (
                 <div key={field.id} className="mb-3 flex items-center">
                    <input type="checkbox" disabled className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500 mr-2 pointer-events-none" />
                    <label className="text-sm text-slate-700">{field.label}</label>
                </div>
            );
        }
        
        return (
            <div key={field.id} className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                    <textarea
                        rows={3}
                        placeholder={field.placeholder}
                        disabled
                        className={`${baseInputClasses} ${styleClasses}`}
                    />
                ) : (
                     <input
                        type={field.type}
                        placeholder={field.placeholder}
                        disabled
                        className={`${baseInputClasses} ${styleClasses}`}
                    />
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: `${paddingY}px ${paddingX}px` }}>
            <div className="space-y-3">
                {formFields.map(renderField)}
            </div>
            <div className="mt-4">
                <button disabled className="w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-md pointer-events-none">
                    {submitButtonText}
                </button>
            </div>
        </div>
    );
};

export default FormBlock;