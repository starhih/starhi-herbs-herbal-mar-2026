'use client';

import { useState, useEffect } from 'react';
import { TOCItem } from '@/data/types';
import { List } from 'lucide-react';

interface BlogTableOfContentsProps {
  items?: TOCItem[];
  className?: string;
}

export default function BlogTableOfContents({ items = [], className = '' }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [dynamicItems, setDynamicItems] = useState<TOCItem[]>(items);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // If no items provided or empty, attempt to gather them dynamically
    if (items.length === 0) {
      const gatherHeadings = () => {
        const headings = document.querySelectorAll('.blog-content h2, .blog-content h3');
        if (headings.length === 0) return;

        const foundItems: TOCItem[] = [];
        headings.forEach((heading) => {
          const text = heading.textContent || '';
          let id = heading.getAttribute('id');

          if (!id) {
            id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            heading.setAttribute('id', id);
          }

          foundItems.push({
            id,
            text,
            level: heading.tagName.toLowerCase() === 'h2' ? 2 : 3
          });
        });

        setDynamicItems(foundItems);
        setIsInitializing(false);
      };

      // Slight delay to ensure ReactMarkdown/RichText has injected titles
      const timeout = setTimeout(gatherHeadings, 100);
      return () => clearTimeout(timeout);
    } else {
      setDynamicItems(items);
      setIsInitializing(false);
    }
  }, [items]);

  useEffect(() => {
    if (dynamicItems.length === 0) return;
    
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

    dynamicItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      dynamicItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [dynamicItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  if (isInitializing && dynamicItems.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 min-h-[250px] animate-pulse ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4 mt-6">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 ml-4"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (dynamicItems.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-[#214842]" />
        <h3 className="text-lg font-semibold text-[#214842]">Table of Contents</h3>
      </div>
      <nav>
        <ul className="space-y-2">
          {dynamicItems.map((item) => (
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
