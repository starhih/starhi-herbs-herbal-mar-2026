'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import DrawerRequestQuoteForm from '@/components/forms/DrawerRequestQuoteForm';
import DrawerRequestSampleForm from '@/components/forms/DrawerRequestSampleForm';
import { Beaker, FileText, X } from 'lucide-react';

interface ProductRequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'quote' | 'sample';
  productName: string;
  productCategory: string;
  productStandardization?: string;
}

export default function ProductRequestDrawer({
  isOpen,
  onClose,
  type,
  productName,
  productCategory,
  productStandardization = '',
}: ProductRequestDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto h-full bg-white flex flex-col p-0">
        {/* Header Bar */}
        <div className="p-6 bg-[#214842] text-white sticky top-0 z-20 shadow-md border-b-4 border-[#EFC368]">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
          
          <SheetHeader className="text-left text-white pr-10">
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white backdrop-blur-sm">
                {type === 'quote' ? <FileText size={18} /> : <Beaker size={18} />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                {type === 'quote' ? 'Commercial pricing' : 'Product Evaluation'}
              </span>
            </div>
            <SheetTitle className="text-xl md:text-2xl font-bold text-white flex items-center justify-between">
              {type === 'quote' ? 'Request a Quote' : 'Request a Sample'}
            </SheetTitle>
            <SheetDescription className="text-white/80 text-xs mt-1">
              For <strong className="text-white font-semibold">{productName}</strong> ({productCategory})
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Form Area */}
        <div className="p-6 flex-1">
          {type === 'quote' ? (
            <DrawerRequestQuoteForm
              productName={productName}
              productCategory={productCategory}
              productStandardization={productStandardization}
              onClose={onClose}
            />
          ) : (
            <DrawerRequestSampleForm
              productName={productName}
              productCategory={productCategory}
              productStandardization={productStandardization}
              onClose={onClose}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
