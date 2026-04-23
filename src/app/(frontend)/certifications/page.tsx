import Image from '@/components/ui/image';
import { getPayloadClient } from '@/lib/payload';
import Link from 'next/link';
import { Metadata } from 'next';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Our Certifications | Star Hi Herbs High-Quality Manufacturer',
  description: 'Star Hi Herbs holds global certifications including ISO, WHO-GMP, FSSC, Halal, Kosher, and Organic, cementing our position as a top herbal extract manufacturer in India.',
  keywords: 'herbal extract manufacturer in bangalore, top herbal extract manufacturer in india, organic extracts, WHO GMP certified manufacturer india, ISO certified herbal extracts, halal herbal extracts, Star Hi Herbs certifications',
  alternates: {
    canonical: '/certifications',
  },
};

export default async function CertificationsPage() {
  const payload = await getPayloadClient();
  const certsResponse = await (payload as any).find({
    collection: 'certifications',
    limit: 100,
    depth: 1, // To populate media relationships like the PDF
    overrideAccess: true, // We are on backend
  });
  const certifications = [...certsResponse.docs].reverse(); // reversed display order

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/certifications-hero.jpg"
          alt="Certifications banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Certifications & Accreditations</h1>
            <p className="text-xl text-white text-shadow-sm">
              Our commitment to the highest international standards in safety, traceability, and quality.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {certifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No certifications found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certifications.map((cert: any) => {
                const imageUrl = cert.imageUrl || (cert.image && typeof cert.image === 'object' && cert.image.url ? cert.image.url : null);
                const pdfObj = cert.certificatePdf && typeof cert.certificatePdf === 'object' ? cert.certificatePdf : null;

                return (
                  <div key={cert.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full border border-gray-100 group">
                    <div className="relative h-48 bg-white border-b border-gray-100 flex items-center justify-center p-6">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={cert.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                          <AwardIcon size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-[#214842] mb-2 text-center">{cert.name}</h3>
                      {cert.description && (
                        <p className="text-gray-600 text-sm mb-6 text-center line-clamp-3">{cert.description}</p>
                      )}
                      
                      <div className="mt-auto space-y-3 pt-4">
                        {pdfObj && pdfObj.url && (
                          <Button asChild className="w-full flex items-center justify-center gap-2 bg-[#214842] hover:bg-[#258F67] text-white">
                            <a href={pdfObj.url} target="_blank" rel="noopener noreferrer" download>
                              <Download size={18} />
                              Download PDF
                            </a>
                          </Button>
                        )}
                        {!pdfObj && (
                          <div className="w-full border border-gray-200 text-gray-500 bg-gray-50 rounded-md py-2.5 px-4 text-center text-sm flex justify-center items-center gap-2">
                             <FileText size={16} />
                             PDF Not Available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function AwardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
