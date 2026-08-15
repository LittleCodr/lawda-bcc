'use client';

import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function ZoomableImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <div className={`relative cursor-pointer group overflow-hidden ${className || ''}`} onClick={() => setIsOpen(true)}>
        <img src={src} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <ZoomIn className="text-white drop-shadow-md" size={24} />
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full flex justify-center animate-in zoom-in-95 duration-200" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-gray-300 p-2 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white" 
            />
          </div>
        </div>
      )}
    </>
  );
}
