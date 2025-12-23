
import React from 'react';
import { TemplateType } from '../types';
import { TEMPLATE_OPTIONS } from '../constants';
import { Layout } from 'lucide-react';

interface TemplateSelectorProps {
  currentTemplate: TemplateType;
  onSelect: (t: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplate, onSelect }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
        <Layout className="w-5 h-5" />
        <h3>Choose Template ({TEMPLATE_OPTIONS.length})</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 custom-scrollbar border border-slate-100 rounded-lg">
        {TEMPLATE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`
              relative p-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-left
              ${currentTemplate === option.id 
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
            `}
          >
            <div className={`w-6 h-6 rounded-full flex-shrink-0 border border-black/5 ${option.color.includes('bg-') ? option.color : 'bg-gray-200'}`} />
            <span className="text-[10px] font-bold text-slate-700 leading-tight">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
