'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import ProductRequestDrawer from '../products/ProductRequestDrawer';

interface ContactButtonsProps {
  productName?: string;
  productCategory?: string;
  productStandardization?: string;
  productType?: string;
}

export default function ContactButtons({
  productName = '',
  productCategory = 'Natural Vitamins & Minerals',
  productStandardization = '',
  productType = '',
}: ContactButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'quote' | 'sample'>('quote');

  const openDrawer = (type: 'quote' | 'sample') => {
    setDrawerType(type);
    setIsOpen(true);
  };

  const isDrawerEnabled = productType === 'vitamin-mineral';

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {isDrawerEnabled ? (
          <>
            <Button
              onClick={() => openDrawer('quote')}
              className="bg-[#214842] hover:bg-[#1a3931] text-white font-medium"
            >
              Request a Quote
            </Button>
            <Button
              onClick={() => openDrawer('sample')}
              variant="outline"
              className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white font-medium"
            >
              Request a Sample
            </Button>
          </>
        ) : (
          <>
            <Button asChild className="bg-[#214842] hover:bg-[#1a3931] text-white font-medium">
              <Link href="/request-quote">Request a Quote</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white font-medium">
              <Link href="/request-sample">Request a Sample</Link>
            </Button>
          </>
        )}
        <Button asChild variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white font-medium">
          <Link href="/request-quote">
            <Download size={16} className="mr-2" />
            Download Catalogue
          </Link>
        </Button>
      </div>

      {isDrawerEnabled && (
        <ProductRequestDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type={drawerType}
          productName={productName}
          productCategory={productCategory}
          productStandardization={productStandardization}
        />
      )}
    </>
  );
}
