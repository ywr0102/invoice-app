
export enum TemplateType {
  // 1. Standard Professional
  STANDARD_BLUE = 'STANDARD_BLUE',
  STANDARD_SLATE = 'STANDARD_SLATE',
  STANDARD_EMERALD = 'STANDARD_EMERALD',
  STANDARD_CRIMSON = 'STANDARD_CRIMSON',

  // 2. Sidebar Series
  SIDEBAR_NAVY = 'SIDEBAR_NAVY',
  SIDEBAR_DARK = 'SIDEBAR_DARK',
  SIDEBAR_TEAL = 'SIDEBAR_TEAL',
  SIDEBAR_INDIGO = 'SIDEBAR_INDIGO',
  SIDEBAR_GOLD = 'SIDEBAR_GOLD',
  SIDEBAR_RIGHT_GRAY = 'SIDEBAR_RIGHT_GRAY',

  // 3. Bold Header
  BOLD_HEADER_BLUE = 'BOLD_HEADER_BLUE',
  BOLD_HEADER_BLACK = 'BOLD_HEADER_BLACK',
  BOLD_HEADER_PURPLE = 'BOLD_HEADER_PURPLE',
  BOLD_HEADER_ORANGE = 'BOLD_HEADER_ORANGE',

  // 4. Minimalist
  MINIMAL_CLEAN = 'MINIMAL_CLEAN',
  MINIMAL_MONO = 'MINIMAL_MONO',
  MINIMAL_FRAMED = 'MINIMAL_FRAMED',
  MINIMAL_DIVIDER = 'MINIMAL_DIVIDER',

  // 5. Executive / Classic
  EXECUTIVE_CLASSIC = 'EXECUTIVE_CLASSIC',
  EXECUTIVE_ELEGANT = 'EXECUTIVE_ELEGANT',
  EXECUTIVE_OFFICIAL = 'EXECUTIVE_OFFICIAL',

  // 6. Grid
  GRID_TECH = 'GRID_TECH',
  GRID_MODERN = 'GRID_MODERN',
  GRID_ACCENT = 'GRID_ACCENT',

  // 7. Creative
  CREATIVE_CORAL = 'CREATIVE_CORAL',
  CREATIVE_MINT = 'CREATIVE_MINT',
  CREATIVE_GRADIENT = 'CREATIVE_GRADIENT',

  // 8. Specialized
  COMPACT_DENSE = 'COMPACT_DENSE',
  CONSULTANT_FLAT = 'CONSULTANT_FLAT',
  SERVICE_SIMPLE = 'SERVICE_SIMPLE',
  IMPACT_RED = 'IMPACT_RED',

  // --- NEW ADDITIONS (Distinct Layouts) ---
  // 9. Modern Business (Clean sans-serif with bold accents)
  MODERN_BOLD_BLACK = 'MODERN_BOLD_BLACK',
  MODERN_STRIP_BLUE = 'MODERN_STRIP_BLUE',
  
  // 10. Timeless (Centered, very formal)
  TIMELESS_CENTERED = 'TIMELESS_CENTERED',
  
  // 11. International (Left aligned, structured)
  INTERNATIONAL_STRUCT = 'INTERNATIONAL_STRUCT',
}

export type FontType = 
  | 'font-sans' 
  | 'font-serif' 
  | 'font-mono'
  | 'font-opensans'
  | 'font-lato'
  | 'font-montserrat'
  | 'font-raleway'
  | 'font-poppins'
  | 'font-oswald'
  | 'font-merriweather'
  | 'font-lora'
  | 'font-ptserif'
  | 'font-crimson'
  | 'font-garamond'
  | 'font-inconsolata';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface SavedProfile {
  id: string;
  name: string;
  address: string;
  email: string;
  logoUrl?: string;
}

export interface InvoiceData {
  documentTitle: string; 
  invoiceNumber: string;
  date: string;
  currency: string;
  
  // Styling
  font: FontType;
  backgroundImage?: string;
  themeColor?: string;

  // Sender
  senderName: string;
  senderAddress: string;
  senderEmail: string;
  logoUrl?: string;
  signatureUrl?: string;

  // Receiver
  receiverName: string;
  receiverAddress: string;
  receiverEmail: string;

  // Economics
  items: InvoiceItem[];
  taxRate: number; 
  discountRate: number; 
  shippingAmount: number; 

  // Footer
  notes: string;
  terms: string;
}

export interface TemplateProps {
  data: InvoiceData;
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}
