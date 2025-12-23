
import React from 'react';
import { InvoiceData, TemplateProps, TemplateType } from '../types';

// --- Configuration Interfaces ---
interface TemplateConfig {
  layout: 'STANDARD' | 'SIDEBAR_LEFT' | 'SIDEBAR_RIGHT' | 'HEADER_BLOCK' | 'GRID' | 'MINIMAL';
  colors: {
    primary: string; // Headings, Accents
    secondary: string; // Subheadings, light backgrounds
    text: string;
    border: string;
    headerBg?: string; // For Header Block
    sidebarBg?: string; // For Sidebar
    sidebarText?: string;
  };
  styles: {
    table: 'STRIPED' | 'SIMPLE' | 'BORDERED' | 'MINIMAL';
    headerAlignment: 'left' | 'right' | 'center' | 'split';
    fontFamily?: string; // Optional override
    uppercaseTitles?: boolean;
    logoPosition?: 'left' | 'right' | 'center' | 'top-left';
  };
}

interface InvoicePreviewProps {
  data: InvoiceData;
  template: TemplateType;
}

// --- Helper: Format Currency ---
const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// --- Helper: Get Template Configuration ---
const getTemplateConfig = (type: TemplateType): TemplateConfig => {
  // Base Defaults
  const base: TemplateConfig = {
    layout: 'STANDARD',
    colors: { primary: 'text-slate-800', secondary: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
    styles: { table: 'STRIPED', headerAlignment: 'split', uppercaseTitles: true, logoPosition: 'left' }
  };

  switch (type) {
    // --- NEW: 9. Modern Business ---
    case TemplateType.MODERN_BOLD_BLACK:
      return {
        layout: 'MINIMAL',
        colors: { ...base.colors, primary: 'text-black', border: 'border-black' },
        styles: { table: 'SIMPLE', headerAlignment: 'split', uppercaseTitles: true, logoPosition: 'left' }
      };
    case TemplateType.MODERN_STRIP_BLUE:
      return {
        layout: 'HEADER_BLOCK',
        // Simulate a thin strip by using header block but we will rely on CSS tweaks or just a colored block
        colors: { ...base.colors, headerBg: 'bg-blue-600', sidebarText: 'text-white', primary: 'text-blue-600', secondary: 'bg-blue-50' },
        styles: { table: 'STRIPED', headerAlignment: 'split', uppercaseTitles: true }
      };

    // --- NEW: 10. Timeless (Centered) ---
    case TemplateType.TIMELESS_CENTERED:
      return {
        layout: 'STANDARD',
        colors: { ...base.colors, primary: 'text-stone-900', border: 'border-stone-200' },
        styles: { table: 'BORDERED', headerAlignment: 'center', logoPosition: 'center', uppercaseTitles: true }
      };

    // --- NEW: 11. International ---
    case TemplateType.INTERNATIONAL_STRUCT:
      return {
        layout: 'GRID',
        colors: { ...base.colors, primary: 'text-slate-800', border: 'border-slate-300', headerBg: 'bg-slate-100' },
        styles: { table: 'BORDERED', headerAlignment: 'left', uppercaseTitles: false }
      };

    // --- 1. Standard Series ---
    case TemplateType.STANDARD_BLUE: 
      return { ...base, colors: { ...base.colors, primary: 'text-blue-600', border: 'border-blue-100', secondary: 'bg-blue-50/50' } };
    case TemplateType.STANDARD_SLATE: 
      return { ...base, colors: { ...base.colors, primary: 'text-slate-800', border: 'border-slate-200' } };
    case TemplateType.STANDARD_EMERALD: 
      return { ...base, colors: { ...base.colors, primary: 'text-emerald-600', secondary: 'bg-emerald-50', border: 'border-emerald-100' } };
    case TemplateType.STANDARD_CRIMSON: 
      return { ...base, colors: { ...base.colors, primary: 'text-red-700', secondary: 'bg-red-50', border: 'border-red-100' } };

    // --- 2. Sidebar Series (Left/Right) ---
    case TemplateType.SIDEBAR_NAVY: 
      return { layout: 'SIDEBAR_LEFT', colors: { ...base.colors, primary: 'text-blue-900', sidebarBg: 'bg-blue-900', sidebarText: 'text-blue-100', secondary: 'bg-blue-50/30' }, styles: { ...base.styles, table: 'SIMPLE' } };
    case TemplateType.SIDEBAR_DARK: 
      return { layout: 'SIDEBAR_LEFT', colors: { ...base.colors, primary: 'text-slate-900', sidebarBg: 'bg-slate-900', sidebarText: 'text-slate-200', secondary: 'bg-slate-100' }, styles: { ...base.styles, table: 'SIMPLE' } };
    case TemplateType.SIDEBAR_TEAL: 
      return { layout: 'SIDEBAR_LEFT', colors: { ...base.colors, primary: 'text-teal-700', sidebarBg: 'bg-teal-700', sidebarText: 'text-teal-50', secondary: 'bg-teal-50' }, styles: { ...base.styles, table: 'STRIPED' } };
    case TemplateType.SIDEBAR_INDIGO: 
      return { layout: 'SIDEBAR_LEFT', colors: { ...base.colors, primary: 'text-indigo-700', sidebarBg: 'bg-indigo-700', sidebarText: 'text-indigo-50', secondary: 'bg-indigo-50' }, styles: { ...base.styles, table: 'STRIPED' } };
    case TemplateType.SIDEBAR_GOLD: 
      return { layout: 'SIDEBAR_LEFT', colors: { ...base.colors, primary: 'text-amber-700', sidebarBg: 'bg-amber-600', sidebarText: 'text-white', secondary: 'bg-amber-50' }, styles: { ...base.styles, table: 'BORDERED' } };
    case TemplateType.SIDEBAR_RIGHT_GRAY: 
      return { layout: 'SIDEBAR_RIGHT', colors: { ...base.colors, primary: 'text-gray-700', sidebarBg: 'bg-gray-100', sidebarText: 'text-gray-800', secondary: 'bg-gray-50' }, styles: { ...base.styles, table: 'SIMPLE' } };

    // --- 3. Bold Header Series ---
    case TemplateType.BOLD_HEADER_BLUE: 
      return { layout: 'HEADER_BLOCK', colors: { ...base.colors, headerBg: 'bg-blue-700', sidebarText: 'text-white', primary: 'text-blue-700', secondary: 'bg-blue-50' }, styles: { ...base.styles, table: 'STRIPED' } };
    case TemplateType.BOLD_HEADER_BLACK: 
      return { layout: 'HEADER_BLOCK', colors: { ...base.colors, headerBg: 'bg-black', sidebarText: 'text-white', primary: 'text-black', secondary: 'bg-gray-100' }, styles: { ...base.styles, table: 'SIMPLE' } };
    case TemplateType.BOLD_HEADER_PURPLE: 
      return { layout: 'HEADER_BLOCK', colors: { ...base.colors, headerBg: 'bg-purple-700', sidebarText: 'text-white', primary: 'text-purple-700', secondary: 'bg-purple-50' }, styles: { ...base.styles, table: 'STRIPED' } };
    case TemplateType.BOLD_HEADER_ORANGE: 
      return { layout: 'HEADER_BLOCK', colors: { ...base.colors, headerBg: 'bg-orange-600', sidebarText: 'text-white', primary: 'text-orange-700', secondary: 'bg-orange-50' }, styles: { ...base.styles, table: 'SIMPLE' } };

    // --- 4. Minimal Series ---
    case TemplateType.MINIMAL_CLEAN: 
      return { layout: 'MINIMAL', colors: { ...base.colors, primary: 'text-black', border: 'border-transparent' }, styles: { ...base.styles, table: 'MINIMAL', headerAlignment: 'left', uppercaseTitles: false } };
    case TemplateType.MINIMAL_MONO: 
      return { layout: 'MINIMAL', colors: { ...base.colors, primary: 'text-slate-800', border: 'border-slate-800' }, styles: { ...base.styles, table: 'SIMPLE', headerAlignment: 'right', uppercaseTitles: true } };
    case TemplateType.MINIMAL_FRAMED: 
      return { layout: 'STANDARD', colors: { ...base.colors, primary: 'text-black', border: 'border-black' }, styles: { ...base.styles, table: 'BORDERED', headerAlignment: 'center', logoPosition: 'center' } };
    case TemplateType.MINIMAL_DIVIDER: 
      return { layout: 'MINIMAL', colors: { ...base.colors, primary: 'text-gray-900', border: 'border-gray-900' }, styles: { ...base.styles, table: 'MINIMAL', headerAlignment: 'split' } };

    // --- 5. Executive Series ---
    case TemplateType.EXECUTIVE_CLASSIC: 
      return { layout: 'STANDARD', colors: { ...base.colors, primary: 'text-stone-800', border: 'border-stone-400', secondary: 'bg-stone-50' }, styles: { ...base.styles, table: 'BORDERED', headerAlignment: 'center', logoPosition: 'top-left' } };
    case TemplateType.EXECUTIVE_ELEGANT: 
      return { layout: 'STANDARD', colors: { ...base.colors, primary: 'text-stone-900', border: 'border-stone-200' }, styles: { ...base.styles, table: 'SIMPLE', headerAlignment: 'split', uppercaseTitles: true } };
    case TemplateType.EXECUTIVE_OFFICIAL: 
      return { layout: 'GRID', colors: { ...base.colors, primary: 'text-slate-800', border: 'border-slate-400', headerBg: 'bg-slate-100' }, styles: { ...base.styles, table: 'BORDERED', headerAlignment: 'left' } };

    // --- 6. Grid Series ---
    case TemplateType.GRID_TECH: 
      return { layout: 'GRID', colors: { ...base.colors, primary: 'text-cyan-700', border: 'border-cyan-200', headerBg: 'bg-cyan-50' }, styles: { ...base.styles, table: 'BORDERED' } };
    case TemplateType.GRID_MODERN: 
      return { layout: 'GRID', colors: { ...base.colors, primary: 'text-sky-700', border: 'border-sky-100', headerBg: 'bg-sky-50' }, styles: { ...base.styles, table: 'STRIPED' } };
    case TemplateType.GRID_ACCENT: 
      return { layout: 'GRID', colors: { ...base.colors, primary: 'text-rose-700', border: 'border-rose-200', headerBg: 'bg-white' }, styles: { ...base.styles, table: 'SIMPLE' } };

    // --- 7. Creative Series ---
    case TemplateType.CREATIVE_CORAL: 
      return { layout: 'STANDARD', colors: { ...base.colors, primary: 'text-rose-500', secondary: 'bg-rose-50', border: 'border-rose-100' }, styles: { ...base.styles, table: 'STRIPED', headerAlignment: 'right', logoPosition: 'left' } };
    case TemplateType.CREATIVE_MINT: 
      return { layout: 'STANDARD', colors: { ...base.colors, primary: 'text-emerald-500', secondary: 'bg-emerald-50', border: 'border-emerald-100' }, styles: { ...base.styles, table: 'SIMPLE', headerAlignment: 'left', logoPosition: 'right' } };
    case TemplateType.CREATIVE_GRADIENT: 
      return { layout: 'HEADER_BLOCK', colors: { ...base.colors, headerBg: 'bg-gradient-to-r from-blue-600 to-purple-600', sidebarText: 'text-white', primary: 'text-purple-600', secondary: 'bg-purple-50' }, styles: { ...base.styles, table: 'STRIPED' } };

    // --- 8. Specialized Series ---
    case TemplateType.COMPACT_DENSE: 
      return { layout: 'STANDARD', colors: { ...base.colors, primary: 'text-gray-800', border: 'border-gray-300' }, styles: { ...base.styles, table: 'BORDERED' } };
    case TemplateType.CONSULTANT_FLAT: 
      return { layout: 'MINIMAL', colors: { ...base.colors, primary: 'text-blue-600', border: 'border-blue-200' }, styles: { ...base.styles, table: 'SIMPLE', headerAlignment: 'left' } };
    case TemplateType.SERVICE_SIMPLE: 
      return { layout: 'STANDARD', colors: { ...base.colors, primary: 'text-indigo-600', secondary: 'bg-indigo-50/50' }, styles: { ...base.styles, table: 'STRIPED' } };
    case TemplateType.IMPACT_RED: 
      return { layout: 'HEADER_BLOCK', colors: { ...base.colors, headerBg: 'bg-red-800', sidebarText: 'text-white', primary: 'text-red-900', secondary: 'bg-red-50' }, styles: { ...base.styles, table: 'BORDERED' } };

    default: return base;
  }
};

// --- Sub-Components ---
const SignatureBlock = ({ url }: { url?: string }) => {
  if (!url) return null;
  return (
    <div className="mt-8 inline-block text-center">
      <img src={url} alt="Signature" className="h-16 object-contain mb-2 mx-auto" crossOrigin="anonymous" />
      <div className="border-t border-slate-300 w-48 pt-1">
        <p className="text-[10px] uppercase font-bold text-slate-400">Authorized Signature</p>
      </div>
    </div>
  );
};

const ItemsTable = ({ data, config, props }: { data: InvoiceData, config: TemplateConfig, props: TemplateProps }) => {
  const { colors, styles } = config;
  
  let headerClass = `py-3 text-xs font-bold uppercase tracking-wider text-left ${colors.primary} border-b-2 ${colors.border}`;
  let rowClass = `border-b ${colors.border}`;
  let cellClass = "py-3 text-sm";
  
  if (styles.table === 'STRIPED') {
    headerClass = `py-3 px-4 text-xs font-bold uppercase tracking-wider text-left ${colors.primary} ${config.colors.secondary}`;
    rowClass = `border-b ${colors.border} odd:bg-white even:${config.colors.secondary}`;
    cellClass = "py-3 px-4 text-sm";
  } else if (styles.table === 'BORDERED') {
    headerClass = `py-2 px-3 text-xs font-bold uppercase tracking-wider text-left border ${colors.border} bg-gray-50 text-gray-700`;
    rowClass = `border ${colors.border}`;
    cellClass = `py-2 px-3 text-sm border-r ${colors.border} last:border-r-0`;
  } else if (styles.table === 'MINIMAL') {
    headerClass = `py-2 text-xs font-bold uppercase tracking-wider text-left border-b ${colors.border} text-gray-500`;
    rowClass = `border-b border-dotted ${colors.border}`;
  } else if (styles.table === 'SIMPLE') {
    headerClass = `py-2 text-xs font-bold uppercase tracking-wider text-left text-gray-400 border-b ${colors.border}`;
    rowClass = `border-b ${colors.border}`;
  }

  return (
    <table className="w-full mb-8 border-collapse table-fixed">
      <thead>
        <tr>
          <th className={`${headerClass} w-[50%]`}>Description</th>
          <th className={`${headerClass} text-right w-[15%]`}>Qty</th>
          <th className={`${headerClass} text-right w-[17.5%]`}>Price</th>
          <th className={`${headerClass} text-right w-[17.5%]`}>Total</th>
        </tr>
      </thead>
      <tbody>
        {data.items.map((item) => (
          <tr key={item.id} className={rowClass}>
            <td className={`${cellClass} font-medium text-slate-800 whitespace-pre-line break-words`}>{item.description}</td>
            <td className={`${cellClass} text-right text-slate-600`}>{item.quantity}</td>
            <td className={`${cellClass} text-right text-slate-600`}>{formatCurrency(item.price, data.currency)}</td>
            <td className={`${cellClass} text-right font-bold text-slate-800`}>{formatCurrency(item.price * item.quantity, data.currency)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TotalsSection = ({ data, config, props }: { data: InvoiceData, config: TemplateConfig, props: TemplateProps }) => {
  const { colors } = config;
  return (
    <div className={`space-y-2 ${config.styles.table === 'STRIPED' || config.styles.table === 'BORDERED' ? 'p-4 rounded ' + config.colors.secondary : ''} break-inside-avoid`}>
      <div className="flex justify-between text-slate-600 text-sm">
        <span>Subtotal</span>
        <span>{formatCurrency(props.subtotal, data.currency)}</span>
      </div>
      {props.discountAmount > 0 && (
        <div className="flex justify-between text-slate-600 text-sm">
          <span>Discount ({data.discountRate}%)</span>
          <span className="text-red-500">-{formatCurrency(props.discountAmount, data.currency)}</span>
        </div>
      )}
      {props.taxAmount > 0 && (
        <div className="flex justify-between text-slate-600 text-sm">
          <span>Tax ({data.taxRate}%)</span>
          <span>{formatCurrency(props.taxAmount, data.currency)}</span>
        </div>
      )}
      {data.shippingAmount > 0 && (
        <div className="flex justify-between text-slate-600 text-sm">
          <span>Shipping</span>
          <span>{formatCurrency(data.shippingAmount, data.currency)}</span>
        </div>
      )}
      <div className={`flex justify-between text-xl font-bold pt-3 mt-2 border-t ${colors.border} ${colors.primary}`}>
        <span>Total</span>
        <span>{formatCurrency(props.total, data.currency)}</span>
      </div>
    </div>
  );
};

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, template }) => {
  const config = getTemplateConfig(template);
  const { colors, styles } = config;
  
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const discountAmount = subtotal * ((data.discountRate || 0) / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * ((data.taxRate || 0) / 100);
  const total = taxableAmount + taxAmount + (data.shippingAmount || 0);
  const templateProps = { data, subtotal, discountAmount, taxableAmount, taxAmount, total };

  // Common Wrapper to enforce A4 size strictly
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div 
     id="invoice-preview"
     className={`bg-white w-[794px] min-h-[1123px] relative ${data.backgroundImage || 'bg-white'} ${data.font}`}
     style={{ margin: '0 auto', boxSizing: 'border-box' }}
    >
      {children}
    </div>
  );

  // --- Layout 1: HEADER BLOCK (Full width color header) ---
  if (config.layout === 'HEADER_BLOCK') {
    return (
      <Wrapper>
        <div className="flex flex-col h-full min-h-[1123px]">
          <div className={`${colors.headerBg} ${colors.sidebarText} p-10 flex justify-between items-start`}>
            <div className="max-w-[50%]">
              {data.logoUrl && <img src={data.logoUrl} className="h-20 w-auto mb-4 bg-white p-2 rounded" crossOrigin="anonymous" />}
              <h1 className="text-4xl font-bold uppercase tracking-tight break-words">{data.senderName}</h1>
              <p className="opacity-80 mt-1 whitespace-pre-line text-sm">{data.senderAddress}</p>
              <p className="opacity-80 text-sm">{data.senderEmail}</p>
            </div>
            <div className="text-right">
              <h2 className="text-5xl font-black opacity-30 uppercase">{data.documentTitle}</h2>
              <div className="mt-2 text-xl font-bold opacity-90">#{data.invoiceNumber}</div>
              <div className="opacity-80">{data.date}</div>
            </div>
          </div>
          
          <div className="p-10 flex-1 bg-white flex flex-col">
            <div className="grid grid-cols-2 gap-10 mb-10">
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${colors.primary}`}>Bill To</h3>
                <p className="font-bold text-lg text-slate-800 whitespace-pre-line">{data.receiverName}</p>
                <p className="text-slate-600 text-sm whitespace-pre-line">{data.receiverAddress}</p>
                <p className="text-slate-600 text-sm">{data.receiverEmail}</p>
              </div>
            </div>

            <ItemsTable data={data} config={config} props={templateProps} />

            <div className="flex justify-end mt-auto">
              <div className="w-1/2 md:w-5/12">
                  <TotalsSection data={data} config={config} props={templateProps} />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end break-inside-avoid">
               <div className="w-2/3">
                  {data.notes && <div className="mb-4"><h4 className="font-bold text-xs text-slate-400 uppercase mb-1">Notes</h4><p className="text-sm text-slate-600 italic">{data.notes}</p></div>}
                  {data.terms && <div><h4 className="font-bold text-xs text-slate-400 uppercase mb-1">Terms</h4><p className="text-xs text-slate-500">{data.terms}</p></div>}
               </div>
               <SignatureBlock url={data.signatureUrl} />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  // --- Layout 2: SIDEBAR (Left or Right) ---
  if (config.layout === 'SIDEBAR_LEFT' || config.layout === 'SIDEBAR_RIGHT') {
    const isRight = config.layout === 'SIDEBAR_RIGHT';
    const Sidebar = (
      <div className={`w-[32%] p-8 flex flex-col ${colors.sidebarBg || 'bg-slate-100'} ${colors.sidebarText || 'text-slate-800'}`}>
        <div className="mb-8">
          {data.logoUrl && <img src={data.logoUrl} className="h-16 w-auto mb-6 object-contain p-1 bg-white rounded" crossOrigin="anonymous" />}
          <h2 className="text-2xl font-bold uppercase leading-none mb-1">{data.documentTitle}</h2>
          <p className="opacity-60 font-mono text-sm">#{data.invoiceNumber}</p>
        </div>
        
        <div className="mb-8 space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">From</h4>
          <p className="font-bold whitespace-pre-line break-words">{data.senderName}</p>
          <p className="text-sm opacity-80 whitespace-pre-line break-words">{data.senderAddress}</p>
          <p className="text-sm opacity-80 break-all">{data.senderEmail}</p>
        </div>

        <div className="mb-8 space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">To</h4>
          <p className="font-bold whitespace-pre-line break-words">{data.receiverName}</p>
          <p className="text-sm opacity-80 whitespace-pre-line break-words">{data.receiverAddress}</p>
          <p className="text-sm opacity-80 break-all">{data.receiverEmail}</p>
        </div>

        <div className="mt-auto">
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Date</h4>
              <p className="font-medium">{data.date}</p>
            </div>
        </div>
      </div>
    );

    return (
      <Wrapper>
        <div className="flex flex-row h-full min-h-[1123px]">
          {!isRight && Sidebar}
          <div className="flex-1 p-8 flex flex-col">
              <ItemsTable data={data} config={config} props={templateProps} />
              
              <div className="flex justify-end mt-4">
                <div className="w-2/3">
                  <TotalsSection data={data} config={config} props={templateProps} />
                </div>
              </div>

              <div className="mt-auto pt-8">
                {data.notes && <p className="text-sm text-slate-600 mb-2 whitespace-pre-line"><span className="font-bold text-slate-800">Note:</span> {data.notes}</p>}
                {data.terms && <p className="text-xs text-slate-400 whitespace-pre-line">{data.terms}</p>}
                <div className="flex justify-end">
                    <SignatureBlock url={data.signatureUrl} />
                </div>
              </div>
          </div>
          {isRight && Sidebar}
        </div>
      </Wrapper>
    );
  }

  // --- Layout 3: GRID / BOXED ---
  if (config.layout === 'GRID') {
    return (
      <Wrapper>
        <div className="p-10 h-full flex flex-col min-h-[1123px]">
            <div className="flex justify-between items-center mb-8 border-b-4 border-slate-800 pb-4">
              <div className="flex items-center gap-4 max-w-[60%]">
                  {data.logoUrl && <img src={data.logoUrl} className="h-16 w-auto" crossOrigin="anonymous" />}
                  <div>
                    <h1 className={`text-2xl font-bold uppercase ${colors.primary} break-words`}>{data.senderName}</h1>
                    <p className="text-xs text-slate-500">{data.senderEmail}</p>
                  </div>
              </div>
              <div className="text-right">
                  <h2 className="text-4xl font-bold text-slate-200 uppercase">{data.documentTitle}</h2>
                  <p className={`font-bold text-lg ${colors.primary}`}>#{data.invoiceNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-4 border ${colors.border} rounded-lg ${colors.headerBg}`}>
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Bill From</h3>
                  <p className="font-bold text-slate-800 whitespace-pre-line">{data.senderName}</p>
                  <p className="text-sm text-slate-600 whitespace-pre-line">{data.senderAddress}</p>
              </div>
              <div className={`p-4 border ${colors.border} rounded-lg`}>
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Bill To</h3>
                  <p className="font-bold text-slate-800 whitespace-pre-line">{data.receiverName}</p>
                  <p className="text-sm text-slate-600 whitespace-pre-line">{data.receiverAddress}</p>
              </div>
            </div>

            <div className="mb-8">
              <ItemsTable data={data} config={config} props={templateProps} />
            </div>

            <div className="grid grid-cols-2 gap-8 mt-auto">
              <div className="pt-4">
                  {data.notes && <div className={`p-4 border ${colors.border} rounded bg-slate-50 text-sm text-slate-600`}>{data.notes}</div>}
                  <div className="mt-8">
                    <SignatureBlock url={data.signatureUrl} />
                  </div>
              </div>
              <div>
                  <TotalsSection data={data} config={config} props={templateProps} />
              </div>
            </div>
        </div>
      </Wrapper>
    )
  }

  // --- Layout 4: MINIMAL & STANDARD (Default) ---
  return (
    <Wrapper>
      <div className="p-10 md:p-14 h-full flex flex-col min-h-[1123px]">
        {/* Header Section - Varies by style */}
        <div className={`flex justify-between items-start mb-12 ${styles.logoPosition === 'center' ? 'flex-col items-center text-center' : ''}`}>
            
            {/* Logo & Sender */}
            <div className={`flex flex-col ${styles.logoPosition === 'center' ? 'items-center w-full' : 'max-w-[60%]'}`}>
              {data.logoUrl && (
                <img 
                  src={data.logoUrl} 
                  className={`h-16 w-auto object-contain mb-4 ${styles.logoPosition === 'center' ? 'mx-auto' : ''}`} 
                  crossOrigin="anonymous" 
                />
              )}
              
              {styles.logoPosition !== 'center' && (
                <>
                  <h1 className={`text-xl font-bold ${colors.primary} break-words`}>{data.senderName}</h1>
                  <p className="text-sm text-slate-500 whitespace-pre-line mt-1">{data.senderAddress}</p>
                  <p className="text-sm text-slate-500">{data.senderEmail}</p>
                </>
              )}
            </div>

            {/* Document Info (Right side usually) */}
            {styles.logoPosition !== 'center' && (
              <div className="text-right">
                <h2 className={`text-4xl font-light ${styles.uppercaseTitles ? 'uppercase tracking-widest' : ''} ${colors.primary}`}>
                  {data.documentTitle}
                </h2>
                <p className="text-slate-500 font-mono mt-1">#{data.invoiceNumber}</p>
                <p className="text-slate-400 text-sm">{data.date}</p>
              </div>
            )}
        </div>

        {/* Centered Header Specific Block */}
        {styles.logoPosition === 'center' && (
          <div className="text-center mb-12 border-y py-6 border-slate-100 w-full">
             <h1 className={`text-3xl font-bold uppercase tracking-widest ${colors.primary} mb-2`}>{data.senderName}</h1>
             <div className="flex justify-center gap-6 text-sm text-slate-500">
                <span>{data.senderAddress.replace(/\n/g, ', ')}</span>
                <span>{data.senderEmail}</span>
             </div>
          </div>
        )}

        {/* Recipient & Details Block */}
        <div className="flex justify-between items-end mb-12">
            <div className="max-w-[50%]">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Bill To</span>
              <h3 className="text-lg font-bold text-slate-800 whitespace-pre-line break-words">{data.receiverName}</h3>
              <p className="text-sm text-slate-600 whitespace-pre-line break-words">{data.receiverAddress}</p>
              <p className="text-sm text-slate-600">{data.receiverEmail}</p>
            </div>
            
            {/* If Centered layout, specific details appear here on the right */}
            {styles.logoPosition === 'center' && (
              <div className="text-right">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Invoice Details</span>
                <p className="font-bold text-slate-800">{data.documentTitle} #{data.invoiceNumber}</p>
                <p className="text-sm text-slate-600">{data.date}</p>
              </div>
            )}
        </div>

        <ItemsTable data={data} config={config} props={templateProps} />

        <div className="flex justify-end mb-12 mt-auto">
          <div className="w-1/2 md:w-5/12">
              <TotalsSection data={data} config={config} props={templateProps} />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex justify-between items-end">
            <div className="w-2/3 pr-8">
              {data.notes && <p className="text-sm text-slate-600 mb-2 whitespace-pre-line"><span className="font-bold">Notes:</span> {data.notes}</p>}
              {data.terms && <p className="text-xs text-slate-400 whitespace-pre-line">{data.terms}</p>}
            </div>
            <SignatureBlock url={data.signatureUrl} />
        </div>
      </div>
    </Wrapper>
  );
};
