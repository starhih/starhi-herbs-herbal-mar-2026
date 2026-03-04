import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      <h1 className="text-4xl font-bold text-[#214842] mb-4">Job Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        The job position you're looking for doesn't exist or may have been filled.
      </p>
      <Button asChild className="bg-[#214842] hover:bg-[#1a3a35]">
        <Link href="/careers" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          View All Job Openings
        </Link>
      </Button>
    </div>
  );
}
