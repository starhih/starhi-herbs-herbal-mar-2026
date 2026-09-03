'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
// @ts-expect-error - no type declarations available
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error - no type declarations available
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface BlogContentProps {
  content: string;
  className?: string;
}

export default function BlogContent({ content, className = '' }: BlogContentProps) {
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
          h2: ({ node: _node, ...props }) => (
            <h2
              className="text-2xl font-semibold text-[#214842] mt-8 mb-4 scroll-mt-24"
              {...props}
            />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3
              className="text-xl font-semibold text-[#214842] mt-6 mb-3 scroll-mt-24"
              {...props}
            />
          ),
          p: ({ node: _node, ...props }) => (
            <p className="text-gray-700 mb-4 leading-relaxed" {...props} />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="list-disc pl-6 mb-4 text-gray-700" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="list-decimal pl-6 mb-4 text-gray-700" {...props} />
          ),
          li: ({ node: _node, ...props }) => (
            <li className="mb-2" {...props} />
          ),
          a: ({ node: _node, ...props }) => (
            <a
              className="text-[#258F67] hover:text-[#214842] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          blockquote: ({ node: _node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#214842] pl-4 italic text-gray-700 my-4"
              {...props}
            />
          ),
          table: ({ node: _node, ...props }) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          thead: ({ node: _node, ...props }) => (
            <thead className="bg-gray-100" {...props} />
          ),
          th: ({ node: _node, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 text-left text-[#214842]" {...props} />
          ),
          td: ({ node: _node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
          code: (props) => {
            const { className, children } = props;
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            return !isInline ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match ? match[1] : ''}
                PreTag="div"
                className="rounded-md my-4"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`${className} bg-gray-100 px-1 py-0.5 rounded text-[#214842]`}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
