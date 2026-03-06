import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CatalogueDownload() {
  return (
    <section className="py-20 bg-[#214842] text-white overflow-hidden relative">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#258F67]/20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#258F67]/10 translate-x-1/3 translate-y-1/3"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Get Our Complete Product Catalogue
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Download our comprehensive product catalogue featuring over 200 herbal extracts,
            probiotics, and nutraceutical ingredients with detailed specifications.
          </p>
          <Button
            className="bg-[#EFC368] text-[#214842] hover:bg-white hover:text-[#214842] text-lg px-8 py-6 h-auto font-semibold"
            asChild
          >
            <Link href="/download-catalogue">
              <Download className="mr-2 h-5 w-5" />
              Download Catalogue
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
