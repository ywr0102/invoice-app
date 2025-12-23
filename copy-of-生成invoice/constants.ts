
import { InvoiceData, TemplateType } from './types';

export const DEFAULT_INVOICE: InvoiceData = {
  documentTitle: 'INVOICE',
  invoiceNumber: 'INV-001',
  date: new Date().toISOString().split('T')[0],
  currency: '$',
  font: 'font-sans',
  
  senderName: 'Acme Corp',
  senderAddress: '123 Business Rd\nTech City, TC 90210',
  senderEmail: 'billing@acmecorp.com',
  
  receiverName: '',
  receiverAddress: '',
  receiverEmail: '',
  
  items: [
    { id: '1', description: 'Professional Services', quantity: 1, price: 1000 },
  ],
  taxRate: 0,
  discountRate: 0,
  shippingAmount: 0,
  
  notes: 'Thank you for your business!',
  terms: 'Payment is due within 30 days.',
  backgroundImage: 'bg-white',
};

export const CURRENCIES = [
  { label: 'USD ($)', value: '$' },
  { label: 'EUR (€)', value: '€' },
  { label: 'GBP (£)', value: '£' },
  { label: 'MYR (RM)', value: 'RM' },
  { label: 'CNY (¥)', value: '¥' },
  { label: 'CAD (C$)', value: 'C$' },
  { label: 'AUD (A$)', value: 'A$' },
];

export const TEMPLATE_OPTIONS = [
  // New & Featured
  { id: TemplateType.MODERN_BOLD_BLACK, label: 'Modern Bold', color: 'bg-slate-900' },
  { id: TemplateType.TIMELESS_CENTERED, label: 'Timeless Serif', color: 'bg-stone-200' },
  { id: TemplateType.MODERN_STRIP_BLUE, label: 'Corporate Strip', color: 'bg-blue-700' },
  { id: TemplateType.INTERNATIONAL_STRUCT, label: 'Global Structure', color: 'bg-gray-700' },

  // 1. Standard
  { id: TemplateType.STANDARD_BLUE, label: 'Standard Blue', color: 'bg-blue-600' },
  { id: TemplateType.STANDARD_SLATE, label: 'Standard Slate', color: 'bg-slate-600' },
  { id: TemplateType.STANDARD_EMERALD, label: 'Standard Green', color: 'bg-emerald-600' },
  { id: TemplateType.STANDARD_CRIMSON, label: 'Standard Red', color: 'bg-red-700' },
  
  // 2. Sidebar
  { id: TemplateType.SIDEBAR_NAVY, label: 'Sidebar Navy', color: 'bg-blue-900' },
  { id: TemplateType.SIDEBAR_DARK, label: 'Sidebar Dark', color: 'bg-slate-900' },
  { id: TemplateType.SIDEBAR_TEAL, label: 'Sidebar Teal', color: 'bg-teal-600' },
  { id: TemplateType.SIDEBAR_RIGHT_GRAY, label: 'Sidebar Right', color: 'bg-gray-500' },

  // 3. Bold Header
  { id: TemplateType.BOLD_HEADER_BLUE, label: 'Bold Blue', color: 'bg-blue-700' },
  { id: TemplateType.BOLD_HEADER_BLACK, label: 'Bold Black', color: 'bg-black' },
  
  // 4. Minimal
  { id: TemplateType.MINIMAL_CLEAN, label: 'Minimal Clean', color: 'bg-white border' },
  { id: TemplateType.MINIMAL_MONO, label: 'Minimal Mono', color: 'bg-slate-200' },
  { id: TemplateType.MINIMAL_FRAMED, label: 'Framed', color: 'bg-white border-2 border-black' },

  // 5. Executive
  { id: TemplateType.EXECUTIVE_CLASSIC, label: 'Executive Serif', color: 'bg-stone-600' },
  { id: TemplateType.EXECUTIVE_OFFICIAL, label: 'Official Box', color: 'bg-slate-700' },

  // 6. Grid
  { id: TemplateType.GRID_TECH, label: 'Tech Grid', color: 'bg-cyan-600' },
  { id: TemplateType.GRID_MODERN, label: 'Modern Grid', color: 'bg-sky-600' },

  // 7. Creative
  { id: TemplateType.CREATIVE_GRADIENT, label: 'Gradient', color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
];

export const FONTS = [
  // Original
  { id: 'font-sans', label: 'Inter (Standard)' },
  { id: 'font-serif', label: 'Playfair (Elegant)' },
  { id: 'font-mono', label: 'Roboto (Code)' },
  
  // New Sans
  { id: 'font-opensans', label: 'Open Sans' },
  { id: 'font-lato', label: 'Lato' },
  { id: 'font-montserrat', label: 'Montserrat' },
  { id: 'font-raleway', label: 'Raleway' },
  { id: 'font-poppins', label: 'Poppins' },
  { id: 'font-oswald', label: 'Oswald (Tall)' },

  // New Serif
  { id: 'font-merriweather', label: 'Merriweather' },
  { id: 'font-lora', label: 'Lora' },
  { id: 'font-ptserif', label: 'PT Serif' },
  { id: 'font-crimson', label: 'Crimson Text' },
  { id: 'font-garamond', label: 'EB Garamond' },

  // New Mono
  { id: 'font-inconsolata', label: 'Inconsolata' },
];

export const DOCUMENT_TYPES = [
  'INVOICE',
  'RECEIPT',
  'QUOTE',
  'ESTIMATE',
  'CREDIT NOTE',
  'PURCHASE ORDER'
];

// Simplified Background Options - Removed complex patterns
export const BACKGROUND_OPTIONS = [
  // 1. Clean Basics
  { id: 'bg-white', label: 'Pure White', class: 'bg-white' },
  { id: 'bg-ivory', label: 'Warm Ivory', class: 'bg-[#fffff0]' },
  { id: 'bg-snow', label: 'Soft Snow', class: 'bg-slate-50' },
  
  // 2. Borders & Frames
  { id: 'bg-border-left', label: 'Blue Left Strip', class: 'bg-white border-l-[12px] border-blue-600' },
  { id: 'bg-border-top', label: 'Dark Top Bar', class: 'bg-white border-t-[12px] border-slate-800' },
  { id: 'bg-border-frame', label: 'Classic Frame', class: 'bg-white border-[1px] border-slate-300 m-2 shadow-[inset_0_0_0_8px_white]' },
  { id: 'bg-border-double', label: 'Double Line', class: 'bg-white m-3 outline outline-2 outline-slate-200 outline-offset-4' },
  
  // 3. Subtle Tints
  { id: 'bg-split-v', label: 'Sidebar Tint', class: 'bg-[linear-gradient(to_right,#f8fafc_33%,#ffffff_33%)]' },
  { id: 'bg-grad-subtle', label: 'Soft Fade', class: 'bg-gradient-to-b from-slate-50/80 to-white' },
];
