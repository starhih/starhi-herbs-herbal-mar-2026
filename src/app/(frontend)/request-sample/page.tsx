import { Metadata } from 'next';
import Link from 'next/link';
import RequestSampleForm from '@/components/forms/RequestSampleForm';
import Image from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Package, FileCheck, FileText, HeadphonesIcon, Lightbulb, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Request a Sample | Star Hi Herbs',
  description: 'Request product samples of our herbal extracts, probiotics, and nutraceutical ingredients for evaluation.',
  keywords: 'sample request, product samples, herbal extracts, probiotics, nutraceutical ingredients',
  openGraph: {
    title: 'Request a Sample | Star Hi Herbs',
    description: 'Request product samples of our herbal extracts, probiotics, and nutraceutical ingredients for evaluation.',
    images: [
      {
        url: '/images/hero/standardized-herbal-extracts.jpeg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs - Request a Sample',
      },
    ],
    type: 'website',
  },
};

export default function RequestSamplePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="/images/hero/standardized-herbal-extracts.jpeg"
          alt="Request a Sample"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-shadow-sm">Request a Sample</h1>
            <p className="text-xl text-white text-shadow-sm">
              Fill out the form below and we&apos;ll process your sample request promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Sidebar Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left: Form */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <RequestSampleForm />
            </div>

            {/* Right: Info Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-8">
              {/* What We Provide */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-5">What We Provide</h3>
                <div className="space-y-5">
                  {[
                    { icon: Package, title: 'Sample Sizes', desc: 'Standard sample size of 25-50g for most products, suitable for R&D and formulation testing.' },
                    { icon: FileCheck, title: 'Certificate of Analysis', desc: 'Every sample comes with a detailed COA including identity, purity, and potency testing results.' },
                    { icon: FileText, title: 'Technical Documentation', desc: 'Complete technical data sheets, product specifications, and application guidelines.' },
                    { icon: HeadphonesIcon, title: 'Technical Support', desc: 'Dedicated support during your evaluation process to answer questions and provide guidance.' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 bg-[#214842]/10 rounded-full flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-[#214842]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#214842]">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Request Process */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-5">Sample Request Process</h3>
                <div className="relative">
                  <div className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-[#214842]/15"></div>
                  {[
                    'Submit your sample request using the form on this page',
                    'Our team will review your request within 1-2 business days',
                    'We\'ll contact you to confirm details and shipping information',
                    'Samples are typically shipped within 3-5 business days after confirmation',
                    'Our technical team will follow up to assist with your evaluation',
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3 mb-4 last:mb-0">
                      <div className="relative z-10 flex-shrink-0 w-7 h-7 bg-[#214842] text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <p className="text-xs text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    Sample requests are subject to approval and availability. We reserve the right to limit sample quantities.
                  </p>
                </div>
              </div>

              {/* Need Help Choosing? */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <Lightbulb className="h-8 w-8 text-[#258F67] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-[#214842] mb-2">Need Help Choosing?</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Not sure which products to sample? Our technical team can help you identify the right extracts for your application.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-5 text-xs text-gray-700">
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Product recommendations</span>
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Application guidance</span>
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Custom formulation support</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" className="bg-[#214842] hover:bg-[#1a3a35] text-white w-full">
                    <Link href="/contact">Contact Our Team</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842]/5 w-full">
                    <Link href="/collections">Browse Products</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
