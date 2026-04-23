import React from 'react';
import Link from 'next/link';

const brandedIngredients = [
  { name: 'Turmimax', imageUrl: 'https://ik.imagekit.io/pon54xoks/Turmimax.svg', url: 'https://turmimax.com/' },
  { name: 'Turmesac', imageUrl: 'https://ik.imagekit.io/pon54xoks/Turmesac.svg', url: 'https://turmesac.in' },
  { name: 'Forcslim', imageUrl: 'https://ik.imagekit.io/pon54xoks/Forcslim.svg', url: 'https://forcslim.com' },
  { name: 'Bacosane', imageUrl: 'https://ik.imagekit.io/pon54xoks/bacosane.svg', url: 'https://bacosane.com' },
  { name: 'Cissuslean', imageUrl: 'https://ik.imagekit.io/pon54xoks/CISSUSLEAN.svg', url: 'https://cissuslean.com' },
  { name: 'Curkolin', imageUrl: 'https://ik.imagekit.io/pon54xoks/Curkolin.svg', url: 'https://curkolin.com' },
  { name: 'Salislim', imageUrl: 'https://ik.imagekit.io/pon54xoks/Salislim.svg', url: 'https://salislim.com' },
  { name: 'Bacospore', imageUrl: 'https://ik.imagekit.io/pon54xoks/bacospore.svg', url: 'https://bacospore.com' },
];

export default function BrandedIngredientsHighlight() {
  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#258F67] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-[#258F67] uppercase tracking-wider mb-2">Our Signature Offerings</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-[#214842]">Premium Branded Ingredients</h3>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover our exclusive range of clinically-backed, trademarked botanical extracts and specialized formulations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {brandedIngredients.map((item) => {
            // Ensure URLs start with http
            const targetUrl = item.url.startsWith('http') ? item.url : `https://${item.url}`;
            
            return (
              <a
                key={item.name}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#258F67]/20 flex items-center justify-center h-28 md:h-36"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#258F67]/0 to-[#258F67]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={`${item.name} Logo`}
                  className="w-full h-full object-contain scale-95 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
