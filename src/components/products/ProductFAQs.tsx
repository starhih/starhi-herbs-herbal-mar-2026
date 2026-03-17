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
    <div className={`rounded-xl ${className}`}>
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <div className="bg-[#214842]/10 p-2.5 rounded-full">
          <HelpCircle className="h-6 w-6 text-[#214842]" />
        </div>
        <h3 className="text-2xl font-bold text-[#214842]">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <div key={`faq-category-${category}`} className="mb-4">
            {hasCategories && Object.keys(groupedFaqs).length > 1 && (
              <h4 className="text-xl font-semibold text-[#214842] mb-5">{category}</h4>
            )}
            
            <div className="space-y-4">
              {categoryFaqs.map((faq, index) => {
                const globalIndex = faqs.findIndex(f => f.id === faq.id);
                const isOpen = openIndex === globalIndex;
                
                return (
                  <div 
                    key={`faq-${faq.id || index}`} 
                    className={`border transition-all duration-300 rounded-xl overflow-hidden ${
                      isOpen ? 'border-[#214842]/30 shadow-md bg-white' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                    }`}
                  >
                    <button
                      className="flex justify-between items-start w-full p-5 text-left transition-colors"
                      onClick={() => toggleFaq(globalIndex)}
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                      <div className={`p-1 rounded-full shrink-0 transition-colors duration-300 ${isOpen ? 'bg-[#214842]/10' : 'bg-gray-200/50'}`}>
                         <ChevronDown 
                           className={`h-5 w-5 transition-transform duration-300 ${
                             isOpen ? 'text-[#214842] transform rotate-180' : 'text-gray-500'
                           }`} 
                         />
                      </div>
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
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
