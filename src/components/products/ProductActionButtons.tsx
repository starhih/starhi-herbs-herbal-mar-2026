'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ProductRequestDrawer from './ProductRequestDrawer';

interface ProductActionButtonsProps {
  productName: string;
  productCategory?: string;
  productStandardization?: string;
}

export default function ProductActionButtons({
  productName,
  productCategory = 'Standardized Botanical Extracts',
  productStandardization = '',
}: ProductActionButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'quote' | 'sample'>('quote');

  const openDrawer = (type: 'quote' | 'sample') => {
    setDrawerType(type);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Button
          onClick={() => openDrawer('quote')}
          className="flex-1 cta-primary flex items-center justify-center h-12 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
        >
          Request Quote
          <ArrowRight size={16} className="ml-2 animate-pulse" />
        </Button>
        <Button
          onClick={() => openDrawer('sample')}
          variant="outline"
          className="flex-1 border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white flex items-center justify-center h-12 text-sm font-semibold rounded-lg transition-all"
        >
          Request Sample
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>

      <ProductRequestDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={drawerType}
        productName={productName}
        productCategory={productCategory}
        productStandardization={productStandardization}
      />
    </>
  );
}
