'use client';

import { useState, useEffect } from 'react';
import { TOCItem } from '@/data/types';
import { List } from 'lucide-react';

interface BlogTableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export default function BlogTableOfContents({ items, className = '' }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0.1 }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-[#214842]" />
        <h3 className="text-lg font-semibold text-[#214842]">Table of Contents</h3>
      </div>
      <nav>
        <ul className="space-y-2">
          {items.map((item) => (
            <li 
              key={item.id}
              className={`
                ${item.level === 2 ? 'ml-0' : 'ml-4'} 
                ${activeId === item.id ? 'text-[#258F67] font-medium' : 'text-gray-600'}
              `}
            >
              <button
                onClick={() => handleClick(item.id)}
                className="text-left hover:text-[#258F67] transition-colors w-full truncate"
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
