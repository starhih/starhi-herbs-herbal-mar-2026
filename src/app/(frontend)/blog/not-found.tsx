import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BlogNotFound() {
  return (
    <section className="py-20 min-h-[60vh] flex items-center">
      <div className="container-custom text-center">
        <h1 className="text-6xl font-bold text-[#214842] mb-6">404</h1>
        <h2 className="text-3xl font-semibold text-[#214842] mb-4">Blog Post Not Found</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          The blog post you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild className="cta-primary">
          <Link href="/blog" className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>
    </section>
  );
}
