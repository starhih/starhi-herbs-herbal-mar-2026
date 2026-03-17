'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichText } from '@/components/RichText';
import ProductFAQs from '@/components/products/ProductFAQs';
import { ProductFAQ } from '@/data/types';

interface CategoryDetailsProps {
  longDescription?: any;
  faqs?: ProductFAQ[];
}

export default function CategoryDetails({ longDescription, faqs }: CategoryDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDescription = longDescription && longDescription.root && longDescription.root.children && longDescription.root.children.length > 0;
  const hasFaqs = faqs && faqs.length > 0;

  if (!hasDescription && !hasFaqs) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container-custom">
        <div className={`relative overflow-hidden transition-all duration-500`}>
          <div className={`max-w-4xl mx-auto space-y-12 transition-all duration-500 ${isExpanded ? '' : 'max-h-[300px] overflow-hidden'}`}>
            {hasDescription && (
              <div className="prose prose-lg max-w-none text-gray-700">
                <RichText content={longDescription} />
              </div>
            )}
            
            {hasFaqs && (
              <div className="mt-12">
                <ProductFAQs faqs={faqs} className="bg-transparent shadow-none px-0" />
              </div>
            )}
          </div>
          
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent pointer-events-none" />
          )}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 border-[1.5px] border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white transition-colors"
          >
            {isExpanded ? (
              <>
                Read Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
