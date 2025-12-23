
import React, { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, Upload, X } from 'lucide-react';

interface SignaturePadProps {
  onChange: (dataUrl: string) => void;
  initialValue?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onChange, initialValue }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  
  useEffect(() => {
     // If we have an initial value and it looks like a signature, we could render it, 
     // but for simplicity, we just keep the parent state valid.
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      const { offsetX, offsetY } = getCoordinates(e, canvas);
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const { offsetX, offsetY } = getCoordinates(e, canvas);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onChange('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('draw')}
            className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${mode === 'draw' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Pen className="w-3 h-3" /> Draw
          </button>
          <button 
            onClick={() => setMode('upload')}
            className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${mode === 'upload' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Upload className="w-3 h-3" /> Upload
          </button>
        </div>
        {mode === 'draw' && (
          <button onClick={clearCanvas} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
             <Eraser className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {mode === 'draw' ? (
        <div className="border border-dashed border-slate-300 rounded bg-slate-50 touch-none">
          <canvas
            ref={canvasRef}
            width={400}
            height={160}
            className="w-full h-32 cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      ) : (
        <div className="relative group cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg h-32 flex justify-center items-center hover:border-blue-400 transition-colors">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="text-center text-slate-500">
             <Upload className="w-6 h-6 mx-auto mb-1" />
             <span className="text-xs">Click to upload image</span>
          </div>
        </div>
      )}
      
      {initialValue && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center">
           <span className="text-xs text-green-600 font-medium">Signature Saved</span>
           <button onClick={() => onChange('')} className="text-xs text-slate-400 hover:text-red-500">Remove</button>
        </div>
      )}
    </div>
  );
};
