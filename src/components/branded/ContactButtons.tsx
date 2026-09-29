'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import ProductActionButtons from '../products/ProductActionButtons';

interface ContactButtonsProps {
  productName?: string;
  productSlug?: string;
  productCategory?: string;
  productStandardization?: string;
  productType?: string;
}

export default function ContactButtons({
  productName = '',
  productSlug,
  productCategory = 'Natural Vitamins & Minerals',
  productStandardization = '',
  productType = '',
}: ContactButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      {productName ? (
        <ProductActionButtons
          productName={productName}
          productSlug={productSlug}
          productType={productType}
          productCategory={productCategory}
          productStandardization={productStandardization}
        />
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-[#214842] hover:bg-[#1a3931] text-white font-medium">
            <Link href="/request-quote">Request a Quote</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white font-medium">
            <Link href="/request-sample">Request a Sample</Link>
          </Button>
        </div>
      )}
      <div>
        <Button asChild variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white font-medium">
          <Link href="/download-catalogue">
            <Download size={16} className="mr-2" />
            Download Catalogue
          </Link>
        </Button>
      </div>
    </div>
  );
}
