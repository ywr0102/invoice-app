
import React, { useState, useEffect, useRef } from 'react';
import { InvoiceEditor } from './components/InvoiceEditor';
import { InvoicePreview } from './components/InvoicePreview';
import { DEFAULT_INVOICE } from './constants';
import { InvoiceData, TemplateType } from './types';
import { Receipt, Printer, Mail, User, X, Loader2, Image as ImageIcon, Download, Share2, Menu, Eye, Edit3 } from 'lucide-react';

// --- Simple Modals ---
const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: (email: string) => void }) => {
  if (!isOpen) return null;
  const [email, setEmail] = useState('');
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
       <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold">Sign In</h2>
             <button onClick={() => onClose('')}><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <p className="text-slate-500 mb-4 text-sm">Save your invoices and templates in the cloud.</p>
          <input 
             className="w-full border p-3 rounded-lg mb-4 text-base" 
             placeholder="Email Address" 
             value={email}
             onChange={e => setEmail(e.target.value)}
          />
          <button 
             onClick={() => onClose(email || 'User')} 
             className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 active:scale-95 transition-all"
          >
            Continue with Email
          </button>
       </div>
    </div>
  );
};

const EmailModal = ({ isOpen, onClose, invoiceId }: { isOpen: boolean; onClose: (success: boolean) => void; invoiceId: string }) => {
  if (!isOpen) return null;
  const [sending, setSending] = useState(false);
  
  const handleSend = () => {
     setSending(true);
     setTimeout(() => {
        setSending(false);
        onClose(true);
     }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
       <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold">Email Invoice #{invoiceId}</h2>
             <button onClick={() => onClose(false)}><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="space-y-3 mb-6">
             <input className="w-full border p-3 rounded-lg text-sm" placeholder="To: client@example.com" />
             <input className="w-full border p-3 rounded-lg text-sm" placeholder="Subject: Invoice from My Company" defaultValue={`Invoice #${invoiceId} from My Company`} />
             <textarea className="w-full border p-3 rounded-lg text-sm h-32 resize-none" placeholder="Message..." defaultValue="Please find attached invoice for your recent order." />
          </div>
          <button 
             onClick={handleSend}
             disabled={sending}
             className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center gap-2 active:scale-95 transition-all"
          >
             {sending ? 'Sending...' : <><Mail className="w-4 h-4" /> Send Invoice</>}
          </button>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [template, setTemplate] = useState<TemplateType>(TemplateType.STANDARD_BLUE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  
  // Modals & UI State
  const [showAuth, setShowAuth] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>(window.innerWidth < 1024 ? 'edit' : 'preview');

  // Scaling logic
  const [previewScale, setPreviewScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     const storedUser = localStorage.getItem('invoice_user');
     if (storedUser) setUser(storedUser);

     const handleResize = () => {
        if (containerRef.current) {
           const containerWidth = containerRef.current.clientWidth;
           const A4_WIDTH = 794;
           // Padding for mobile (16px on each side) = 32px buffer
           const buffer = 32; 
           
           if (containerWidth < (A4_WIDTH + buffer)) {
              // Scale to fit width, leaving a small margin
              const newScale = (containerWidth - buffer) / A4_WIDTH;
              setPreviewScale(newScale);
           } else {
              setPreviewScale(1);
           }
        }
        
        // Auto-switch to split view on desktop
        if (window.innerWidth >= 1024 && viewMode !== 'preview') {
           setViewMode('preview');
        }
     };

     window.addEventListener('resize', handleResize);
     handleResize(); 
     // Double check after render
     setTimeout(handleResize, 100);
     return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]); 

  const handleLogin = (email: string) => {
     if (email) {
        localStorage.setItem('invoice_user', email);
        setUser(email);
     }
     setShowAuth(false);
  };

  const handleLogout = () => {
     localStorage.removeItem('invoice_user');
     setUser(null);
  };

  const handleShare = async () => {
     const url = window.location.href;
     if (navigator.share) {
        try {
           await navigator.share({ title: 'Invoice Generator', url });
        } catch (e) { console.log('Share canceled'); }
     } else {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
     }
  };

  const handlePrint = () => {
     window.print();
  };

  const getSafeFilename = (ext: 'png' | 'pdf') => {
    const clientRaw = invoiceData.receiverName || 'Client';
    const safeClient = clientRaw.replace(/[^a-z0-9\u4e00-\u9fa5\s\-_]/gi, '').trim().replace(/\s+/g, '_');
    const numberRaw = invoiceData.invoiceNumber || 'DRAFT';
    const safeNumber = numberRaw.replace(/[^a-z0-9\u4e00-\u9fa5\s\-_]/gi, '').trim();
    return `Invoice-${safeNumber}_${safeClient}.${ext}`;
  };

  // --- Robust Export Logic ---
  const createCloneForExport = async () => {
    const element = document.getElementById('invoice-preview');
    if (!element) throw new Error('Preview element not found');

    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;

    // Use a fixed off-screen container. 
    // IMPORTANT: Top -9999px ensures it's not visible but browser renders layout correctly.
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '-9999px'; 
    container.style.width = `${A4_WIDTH_PX}px`;
    container.style.zIndex = '9999'; 
    container.style.backgroundColor = '#ffffff';
    document.body.appendChild(container);

    const clone = element.cloneNode(true) as HTMLElement;
    // Reset any transform/margins on the clone to ensure clean capture
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.width = `${A4_WIDTH_PX}px`;
    clone.style.minHeight = `${A4_HEIGHT_PX}px`;
    clone.style.boxShadow = 'none';
    
    container.appendChild(clone);

    // Wait for images
    const images = Array.from(clone.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve; 
      });
    }));

    // Small delay for layout repaint
    await new Promise(resolve => setTimeout(resolve, 500));

    // Determine actual height
    const contentHeight = clone.scrollHeight;
    let finalHeight = Math.max(contentHeight, A4_HEIGHT_PX);
    
    // Auto-fit logic for single page PDF if close enough
    if (contentHeight > A4_HEIGHT_PX && contentHeight < 1350) {
       const scale = A4_HEIGHT_PX / contentHeight;
       clone.style.transform = `scale(${scale})`;
       clone.style.transformOrigin = 'top left';
       // We must increase width to compensate for scale down to fill page width
       clone.style.width = `${A4_WIDTH_PX / scale}px`; 
       finalHeight = A4_HEIGHT_PX;
       
       container.style.height = `${A4_HEIGHT_PX}px`;
       container.style.width = `${A4_WIDTH_PX}px`;
       container.style.overflow = 'hidden';
    } else {
       container.style.height = `${finalHeight}px`;
    }

    return { container, finalHeight, width: A4_WIDTH_PX };
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    let cleanup: (() => void) | null = null;
    let overlay: HTMLElement | null = null;

    try {
        // @ts-ignore
        if (typeof window.html2canvas === 'undefined') throw new Error('Library missing');

        overlay = createOverlay('Generating High-Res Image...');
        
        const { container, finalHeight, width } = await createCloneForExport();
        cleanup = () => { if(document.body.contains(container)) document.body.removeChild(container); };

        // @ts-ignore
        const canvas = await window.html2canvas(container, {
            scale: 2, 
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: width,
            height: finalHeight,
            windowWidth: width,
            windowHeight: finalHeight,
            scrollY: 0,
            scrollX: 0,
            logging: false
        });

        const link = document.createElement('a');
        link.download = getSafeFilename('png');
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();

    } catch (e: any) {
        console.error(e);
        alert(`Export failed: ${e.message}`);
    } finally {
        if (cleanup) cleanup();
        if (overlay) overlay.remove();
        setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    let cleanup: (() => void) | null = null;
    let overlay: HTMLElement | null = null;

    try {
        // @ts-ignore
        if (typeof window.html2pdf === 'undefined') throw new Error('Library missing');

        overlay = createOverlay('Generating PDF...');

        const { container } = await createCloneForExport();
        cleanup = () => { if(document.body.contains(container)) document.body.removeChild(container); };

        const opt = {
          margin: 0,
          filename: getSafeFilename('pdf'),
          image: { type: 'jpeg', quality: 0.98 },
          enableLinks: true,
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
            backgroundColor: '#ffffff'
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // @ts-ignore
        await window.html2pdf().set(opt).from(container).save();

    } catch (e: any) {
        console.error(e);
        alert(`PDF failed: ${e.message}`);
    } finally {
        if (cleanup) cleanup();
        if (overlay) overlay.remove();
        setIsGenerating(false);
    }
  };

  const createOverlay = (text: string) => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: '99999',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    });
    overlay.innerHTML = `<div style="font-family: sans-serif; color: #333; font-weight: bold; display: flex; flex-direction: column; align-items: center; gap: 10px;"><div style="width: 20px; height: 20px; border: 3px solid #ccc; border-top-color: #333; border-radius: 50%; animation: spin 1s linear infinite;"></div>${text}</div><style>@keyframes spin { to { transform: rotate(360deg); } }</style>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  // Calculate the visual height of the scaled preview to force the container to scroll correctly
  const scaledHeight = 1123 * previewScale;

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      <AuthModal isOpen={showAuth} onClose={handleLogin} />
      <EmailModal isOpen={showEmail} onClose={(s) => { setShowEmail(false); if(s) alert('Sent!'); }} invoiceId={invoiceData.invoiceNumber} />

      {/* --- Header --- */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center no-print z-50 shadow-sm h-14 flex-shrink-0 relative">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
             <Receipt className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight hidden sm:block">InvoiceGenius</h1>
        </div>
        
        {/* Centered Toggle for Mobile */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex lg:hidden bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'edit' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              <Edit3 className="w-3 h-3" /> Editor
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'preview' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              <Eye className="w-3 h-3" /> Preview
            </button>
        </div>

        <div className="flex items-center gap-2">
           <button onClick={handleShare} className="p-2 text-slate-500 hover:text-blue-600 active:scale-95 transition-transform">
              <Share2 className="w-5 h-5" />
           </button>
           {user ? (
             <button onClick={handleLogout} className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">{user[0].toUpperCase()}</button>
           ) : (
             <button onClick={() => setShowAuth(true)} className="text-sm font-medium text-blue-600 p-1"><User className="w-5 h-5" /></button>
           )}
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* --- Editor Sidebar --- */}
        <aside 
          className={`
            w-full lg:w-[480px] xl:w-[550px] bg-white border-r border-slate-200 no-print z-20 h-full flex flex-col shadow-xl absolute lg:relative transition-transform duration-300 ease-in-out
            ${viewMode === 'edit' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
           <div className="flex-1 overflow-y-auto custom-scrollbar">
             <InvoiceEditor 
                data={invoiceData} 
                onChange={setInvoiceData} 
                template={template}
                onTemplateChange={setTemplate}
             />
           </div>
        </aside>

        {/* --- Preview Area --- */}
        {/* Ref is on the container that scrolls */}
        <section 
          ref={containerRef}
          className={`
            flex-1 bg-slate-200/50 overflow-y-auto overflow-x-hidden relative print:overflow-visible print:bg-white print:p-0
            ${viewMode === 'preview' ? 'block' : 'hidden lg:block'}
          `}
        >
           {/* Center Content Wrapper */}
           <div className="min-h-full flex flex-col items-center py-8 px-4 no-print">
               
               {/* Invoice Scaler Container */}
               {/* We set height explicitly to match scaled content so scrollbar works */}
               <div style={{ width: 794 * previewScale, height: scaledHeight, position: 'relative' }}>
                  <div 
                     style={{ 
                       transform: `scale(${previewScale})`,
                       transformOrigin: 'top left',
                       width: '794px',
                       // The min-height is set in the component, but we allow it to grow
                     }}
                     className="bg-white shadow-2xl transition-transform duration-200 ease-out origin-top-left"
                  >
                      <InvoicePreview data={invoiceData} template={template} />
                  </div>
               </div>

               {/* Spacer for Floating Bar */}
               <div className="h-24 w-full"></div>
           </div>
           
           {/* Floating Action Bar */}
           <div className="no-print fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-full shadow-2xl z-50 items-center animate-in slide-in-from-bottom-6">
              <button onClick={handlePrint} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95" title="Print">
                <Printer className="w-5 h-5" />
              </button>
              <button onClick={() => setShowEmail(true)} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95" title="Email">
                <Mail className="w-5 h-5" />
              </button>
              <button onClick={handleDownloadImage} disabled={isGenerating} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95" title="Save Image">
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              </button>
              <div className="w-px h-6 bg-slate-600 mx-1"></div>
              <button onClick={handleDownloadPDF} disabled={isGenerating} className="h-10 px-6 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-2 text-sm">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>PDF</span>
              </button>
           </div>
        </section>
      </main>
    </div>
  );
};

export default App;
