'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';

interface BlogContentProps {
  content: string;
  className?: string;
}

export default function SimpleBlogContent({ content, className = '' }: BlogContentProps) {
  // Add IDs to headings for table of contents
  useEffect(() => {
    const headings = document.querySelectorAll('.blog-content h2, .blog-content h3');
    headings.forEach((heading) => {
      const text = heading.textContent || '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      heading.setAttribute('id', id);
    });
  }, [content]);

  return (
    <div className={`blog-content prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          h2: ({ node, ...props }) => (
            <h2
              className="text-2xl font-semibold text-[#214842] mt-8 mb-4 scroll-mt-24"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-xl font-semibold text-[#214842] mt-6 mb-3 scroll-mt-24"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 mb-4 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-4 text-gray-700" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-4 text-gray-700" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-2" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-[#258F67] hover:text-[#214842] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#214842] pl-4 italic text-gray-700 my-4"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-100" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 text-left text-[#214842]" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
          code: (props) => {
            const { className, children } = props;
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            return isInline ? (
              <code
                className={`${className} bg-gray-100 px-1 py-0.5 rounded text-[#214842]`}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                <code className={className}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
