
import React, { useState, useRef, useEffect } from 'react';
import { InvoiceData, InvoiceItem, SavedProfile, TemplateType } from '../types';
import { CURRENCIES, BACKGROUND_OPTIONS, FONTS, DOCUMENT_TYPES } from '../constants';
import { 
  Plus, Trash2, Upload, User, MapPin, Image as ImageIcon, Type, FileText, 
  Settings, Save, RefreshCw, Bookmark, FolderOpen, ChevronDown, ChevronUp,
  Palette, Briefcase, ShoppingCart, Percent
} from 'lucide-react';
import { AIGenerator } from './AIGenerator';
import { SignaturePad } from './SignaturePad';
import { TemplateSelector } from './TemplateSelector';

interface InvoiceEditorProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  template: TemplateType;
  onTemplateChange: (t: TemplateType) => void;
}

const LineInput = ({ 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  className = "",
  autoComplete = "off"
}: { 
  value: string | number, 
  onChange: (val: string) => void, 
  placeholder?: string,
  type?: string,
  className?: string,
  autoComplete?: string
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all ${className}`}
    placeholder={placeholder}
    autoComplete={autoComplete}
  />
);

const AutoTextArea = ({
  value,
  onChange,
  placeholder,
  className = "",
  minHeight = "42px"
}: {
  value: string | number,
  onChange: (val: string) => void,
  placeholder?: string,
  className?: string,
  minHeight?: string
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all resize-none overflow-hidden ${className}`}
      placeholder={placeholder}
      rows={1}
      style={{ minHeight }}
    />
  );
};

// --- Reusable Accordion Section ---
const EditorSection = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children,
  badge
}: { 
  title: string, 
  icon: any, 
  isOpen: boolean, 
  onToggle: () => void, 
  children: React.ReactNode,
  badge?: string
}) => (
  <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden mb-3 transition-all duration-300">
    <button 
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-4 text-left transition-colors ${isOpen ? 'bg-slate-50 border-b border-slate-100' : 'bg-white hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-sm font-bold ${isOpen ? 'text-slate-900' : 'text-slate-600'}`}>{title}</span>
        {badge && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
      </div>
      {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
    </button>
    
    {isOpen && (
      <div className="p-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-white">
        {children}
      </div>
    )}
  </div>
);

// --- Saved Profiles Manager ---
const ProfileManager = ({ 
  type, 
  currentData, 
  onLoad,
  storageKey 
}: { 
  type: 'Sender' | 'Client', 
  currentData: { name: string, address: string, email: string, logoUrl?: string },
  onLoad: (p: SavedProfile) => void,
  storageKey: string
}) => {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setProfiles(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  }, [storageKey]);

  const saveProfile = () => {
    if (!currentData.name.trim()) {
      alert(`Please enter a ${type} Name to save.`);
      return;
    }
    const newProfile: SavedProfile = {
      id: crypto.randomUUID(),
      name: currentData.name,
      address: currentData.address,
      email: currentData.email,
      logoUrl: currentData.logoUrl
    };

    const existingIndex = profiles.findIndex(p => p.name.toLowerCase() === newProfile.name.toLowerCase());
    let newProfiles = [...profiles];
    
    if (existingIndex >= 0) {
      if(!confirm(`Overwrite existing profile "${newProfile.name}"?`)) return;
      newProfiles[existingIndex] = newProfile;
    } else {
      newProfiles.push(newProfile);
    }

    setProfiles(newProfiles);
    localStorage.setItem(storageKey, JSON.stringify(newProfiles));
    alert(`${type} saved successfully!`);
  };

  const deleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      const newProfiles = profiles.filter(p => p.id !== id);
      setProfiles(newProfiles);
      localStorage.setItem(storageKey, JSON.stringify(newProfiles));
      if (selectedId === id) setSelectedId('');
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);
    if (id) {
      const profile = profiles.find(p => p.id === id);
      if (profile) onLoad(profile);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <FolderOpen className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <select 
          value={selectedId} 
          onChange={handleSelect}
          className="w-full bg-transparent text-xs font-medium text-slate-700 outline-none truncate"
        >
          <option value="">Load saved {type}...</option>
          {profiles.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      {selectedId && (
        <button onClick={() => deleteProfile(selectedId)} className="p-1 text-slate-400 hover:text-red-500 rounded">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="w-px h-4 bg-slate-300 mx-1"></div>
      <button 
        onClick={saveProfile}
        className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:bg-blue-50 px-2 py-1.5 rounded transition-colors whitespace-nowrap"
      >
        <Bookmark className="w-3.5 h-3.5" /> Save
      </button>
    </div>
  );
};


export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ data, onChange, template, onTemplateChange }) => {
  const [draftSaved, setDraftSaved] = useState(false);
  
  // Section Toggle State
  const [sections, setSections] = useState({
    details: true,
    design: false,
    people: false,
    items: true,
    totals: true,
    footer: false
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter(i => i.id !== id) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDraft = () => {
    localStorage.setItem('invoice_draft', JSON.stringify(data));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const loadDraft = () => {
    const saved = localStorage.getItem('invoice_draft');
    if (saved) {
      if (confirm('Load saved draft? This will overwrite current changes.')) {
        onChange(JSON.parse(saved));
      }
    } else {
      alert('No draft found.');
    }
  };

  const generateInvoiceNumber = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    handleChange('invoiceNumber', `INV-${num}`);
  };

  return (
    <div className="p-4 space-y-4 bg-white min-h-full font-sans pb-40 lg:pb-32">
      
      {/* --- Action Toolbar --- */}
      <div className="flex justify-between items-center mb-6 bg-slate-50 p-2.5 rounded-lg border border-slate-200 sticky top-0 z-10 shadow-sm backdrop-blur-sm bg-slate-50/90">
         <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider">Actions</span>
         <div className="flex gap-2">
            <button onClick={loadDraft} className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors font-medium">Load Draft</button>
            <button 
              onClick={saveDraft}
              className="flex items-center gap-1.5 text-xs bg-white border border-slate-300 hover:border-blue-400 text-slate-700 px-3 py-1.5 rounded-md font-bold transition-colors shadow-sm active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> {draftSaved ? 'Saved!' : 'Save Progress'}
            </button>
         </div>
      </div>

      {/* --- 1. Document Info (Core) --- */}
      <EditorSection 
        title="Core Information" 
        icon={FileText} 
        isOpen={sections.details} 
        onToggle={() => toggleSection('details')}
      >
          <div className="space-y-4">
            <div className="flex gap-4">
               <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Doc Type</label>
                  <select 
                    value={data.documentTitle}
                    onChange={(e) => handleChange('documentTitle', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
               <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Currency</label>
                  <select 
                    value={data.currency} 
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
               </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Invoice #</label>
                 <div className="relative">
                   <LineInput value={data.invoiceNumber} onChange={(v) => handleChange('invoiceNumber', v)} />
                   <button onClick={generateInvoiceNumber} className="absolute right-3 top-3 text-slate-400 hover:text-blue-600" title="Auto-Generate">
                       <RefreshCw className="w-4 h-4" />
                   </button>
                 </div>
              </div>
              <div className="flex-1">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Date</label>
                 <LineInput type="date" value={data.date} onChange={(v) => handleChange('date', v)} />
              </div>
            </div>
          </div>
      </EditorSection>

      {/* --- 2. Design Studio (Collapsed) --- */}
      <EditorSection 
        title="Template & Branding" 
        icon={Palette} 
        isOpen={sections.design} 
        onToggle={() => toggleSection('design')}
        badge="Styles"
      >
         <div className="space-y-6">
             <TemplateSelector currentTemplate={template} onSelect={onTemplateChange} />
             
             <div className="border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-500 mb-3 block flex items-center gap-1"><Type className="w-3.5 h-3.5"/> Typography</label>
                <div className="flex flex-wrap gap-2">
                   {FONTS.map(f => (
                     <button
                       key={f.id}
                       onClick={() => handleChange('font', f.id)}
                       className={`text-xs py-2 px-3 rounded-full border transition-all ${data.font === f.id ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}
                     >
                       {f.label.split(' ')[0]}
                     </button>
                   ))}
                </div>
             </div>

             <div>
                <label className="text-xs font-bold text-slate-500 mb-3 block flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5"/> Paper Style</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                  {BACKGROUND_OPTIONS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => handleChange('backgroundImage', bg.class)}
                      className={`h-14 rounded-lg border transition-all relative shadow-sm ${bg.class} ${data.backgroundImage === bg.class ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : 'border-slate-200 hover:scale-105'}`}
                      title={bg.label}
                    />
                  ))}
                </div>
             </div>
         </div>
      </EditorSection>

      {/* --- 3. People --- */}
      <EditorSection 
        title="Sender & Client" 
        icon={Briefcase} 
        isOpen={sections.people} 
        onToggle={() => toggleSection('people')}
      >
          <div className="space-y-6">
            {/* Sender */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" /> From (Sender)
               </div>
               <ProfileManager 
                  type="Sender"
                  storageKey="invoice_saved_senders"
                  currentData={{ name: data.senderName, address: data.senderAddress, email: data.senderEmail, logoUrl: data.logoUrl }}
                  onLoad={(p) => onChange({ ...data, senderName: p.name, senderAddress: p.address, senderEmail: p.email, logoUrl: p.logoUrl || data.logoUrl })}
               />
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                     <AutoTextArea placeholder="Company Name" value={data.senderName} onChange={(v) => handleChange('senderName', v)} />
                     <AutoTextArea placeholder="Address..." value={data.senderAddress} onChange={(v) => handleChange('senderAddress', v)} minHeight="60px" />
                     <AutoTextArea placeholder="Email / Phone" value={data.senderEmail} onChange={(v) => handleChange('senderEmail', v)} />
                  </div>
                  <div className="w-full sm:w-24">
                      <div className="relative group cursor-pointer bg-white border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 w-full h-24 sm:h-24 flex justify-center items-center overflow-hidden transition-colors">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {data.logoUrl ? <img src={data.logoUrl} className="w-full h-full object-contain p-1" /> : <div className="text-center"><Upload className="w-5 h-5 text-slate-400 mx-auto" /><span className="text-[9px] text-slate-400 block mt-1">Logo</span></div>}
                      </div>
                  </div>
               </div>
            </div>

            {/* Receiver */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" /> To (Client)
               </div>
               <ProfileManager 
                  type="Client"
                  storageKey="invoice_saved_clients"
                  currentData={{ name: data.receiverName, address: data.receiverAddress, email: data.receiverEmail }}
                  onLoad={(p) => onChange({ ...data, receiverName: p.name, receiverAddress: p.address, receiverEmail: p.email })}
               />
               <div className="space-y-3">
                  <AutoTextArea placeholder="Client Name" value={data.receiverName} onChange={(v) => handleChange('receiverName', v)} />
                  <AutoTextArea placeholder="Client Address..." value={data.receiverAddress} onChange={(v) => handleChange('receiverAddress', v)} minHeight="60px" />
                  <AutoTextArea placeholder="Client Email" value={data.receiverEmail} onChange={(v) => handleChange('receiverEmail', v)} />
               </div>
            </div>
          </div>
      </EditorSection>

      {/* --- 4. Line Items --- */}
      <EditorSection 
        title="Items" 
        icon={ShoppingCart} 
        isOpen={sections.items} 
        onToggle={() => toggleSection('items')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
               <div className="col-span-6">Desc</div>
               <div className="col-span-2 text-right">Qty</div>
               <div className="col-span-3 text-right">$$</div>
               <div className="col-span-1"></div>
          </div>
          
          {data.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-start group relative">
                <div className="col-span-6">
                  <AutoTextArea
                    value={item.description}
                    onChange={(v) => handleItemChange(item.id, 'description', v)}
                    placeholder="Item..."
                  />
                </div>
                <div className="col-span-2">
                  <input type="number" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-right h-[46px]" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))} />
                </div>
                <div className="col-span-3">
                  <input type="number" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-right h-[46px]" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))} />
                </div>
                <div className="col-span-1 flex justify-center items-center h-[46px]">
                  <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
            </div>
          ))}

          <button onClick={addItem} className="w-full mt-2 py-3 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </EditorSection>

      {/* --- 5. Taxes & Totals --- */}
      <EditorSection 
        title="Totals" 
        icon={Percent} 
        isOpen={sections.totals} 
        onToggle={() => toggleSection('totals')}
      >
        <div className="grid grid-cols-3 gap-3">
             <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">Disc %</label>
                <input type="number" value={data.discountRate} onChange={(e) => handleChange('discountRate', Number(e.target.value))} className="w-full p-3 border border-slate-200 rounded-lg text-sm text-right" placeholder="0" />
             </div>
             <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">Tax %</label>
                <input type="number" value={data.taxRate} onChange={(e) => handleChange('taxRate', Number(e.target.value))} className="w-full p-3 border border-slate-200 rounded-lg text-sm text-right" placeholder="0" />
             </div>
             <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">Ship</label>
                <input type="number" value={data.shippingAmount} onChange={(e) => handleChange('shippingAmount', Number(e.target.value))} className="w-full p-3 border border-slate-200 rounded-lg text-sm text-right" placeholder="0" />
             </div>
        </div>
      </EditorSection>

      {/* --- 6. Footer --- */}
      <EditorSection 
        title="Footer" 
        icon={Settings} 
        isOpen={sections.footer} 
        onToggle={() => toggleSection('footer')}
      >
        <div className="space-y-6">
          <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-500">Notes</span>
                <AIGenerator context="Notes" onApply={(t) => handleChange('notes', t)} />
              </div>
              <AutoTextArea value={data.notes} onChange={(v) => handleChange('notes', v)} minHeight="60px" />
          </div>
          <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-500">Terms</span>
                <AIGenerator context="Terms & Conditions" onApply={(t) => handleChange('terms', t)} />
              </div>
              <AutoTextArea value={data.terms} onChange={(v) => handleChange('terms', v)} minHeight="60px" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 mb-3 block">Signature</span>
            <div className="touch-none border border-slate-200 rounded-lg overflow-hidden">
               <SignaturePad onChange={(url) => handleChange('signatureUrl', url)} initialValue={data.signatureUrl} />
            </div>
          </div>
        </div>
      </EditorSection>

    </div>
  );
};
