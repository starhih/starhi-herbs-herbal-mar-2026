'use client';

import { BaseComponentProps } from '@/types/component';
import { ProductFAQ } from '@/data/types';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface ProductFAQsProps extends BaseComponentProps {
  faqs: ProductFAQ[];
}

export default function ProductFAQs({ faqs, className = '' }: ProductFAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  // Group FAQs by category if they have categories
  const hasCategories = faqs.some(faq => faq.category);
  
  const groupedFaqs = hasCategories 
    ? faqs.reduce((acc, faq) => {
        const category = faq.category || 'General';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(faq);
        return acc;
      }, {} as Record<string, ProductFAQ[]>)
    : { 'General': faqs };

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#214842]/10 p-2 rounded-full">
          <HelpCircle className="h-5 w-5 text-[#214842]" />
        </div>
        <h3 className="text-xl font-semibold text-[#214842]">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <div key={`faq-category-${category}`}>
            {hasCategories && Object.keys(groupedFaqs).length > 1 && (
              <h4 className="text-lg font-medium text-[#214842] mb-4">{category}</h4>
            )}
            
            <div className="space-y-4">
              {categoryFaqs.map((faq, index) => {
                const globalIndex = faqs.findIndex(f => f.id === faq.id);
                const isOpen = openIndex === globalIndex;
                
                return (
                  <div 
                    key={`faq-${faq.id || index}`} 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => toggleFaq(globalIndex)}
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-[#214842]">{faq.question}</span>
                      <ChevronDown 
                        className={`h-5 w-5 text-[#214842] transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
                      />
                    </button>
                    
                    {isOpen && (
                      <div className="p-4 bg-white">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
