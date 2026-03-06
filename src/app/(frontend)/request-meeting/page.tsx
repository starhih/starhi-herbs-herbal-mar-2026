import { Metadata } from 'next';
import Link from 'next/link';
import RequestMeetingForm from '@/components/forms/RequestMeetingForm';
import Image from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Beaker, Wrench, ShieldCheck, Handshake, AlertCircle, MessageSquare } from 'lucide-react';
import { getPayloadClient } from '@/lib/payload';
import { mapEvent } from '@/lib/mappers';

export const metadata: Metadata = {
  title: 'Request a Meeting | Star Hi Herbs',
  description: 'Schedule a meeting with our team at upcoming industry events to discuss your herbal extract requirements.',
  keywords: 'meeting request, industry events, trade shows, herbal extracts, nutraceutical ingredients',
  openGraph: {
    title: 'Request a Meeting | Star Hi Herbs',
    description: 'Schedule a meeting with our team at upcoming industry events to discuss your herbal extract requirements.',
    images: [
      {
        url: '/images/events/event-meeting.jpg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs - Request a Meeting',
      },
    ],
    type: 'website',
  },
};

export default async function RequestMeetingPage() {
  const payload = await getPayloadClient();

  // Fetch upcoming events from Payload
  const { docs: eventDocs } = await payload.find({
    collection: 'events',
    where: { upcoming: { equals: true } },
    pagination: false,
  });
  const events = eventDocs.map(mapEvent).filter(Boolean);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="/images/events/event-meeting.jpg"
          alt="Request a Meeting"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Request a Meeting</h1>
            <p className="text-xl text-white text-shadow-sm">
              Fill out the form below to schedule a meeting with our team at an upcoming event.
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
              <RequestMeetingForm events={events} />
            </div>

            {/* Right: Info Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-8">
              {/* Why Meet With Us */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-5">Why Meet With Us</h3>
                <div className="space-y-5">
                  {[
                    { icon: Beaker, title: 'Product Expertise', desc: 'Discuss your specific requirements with our technical experts who can recommend the right herbal extracts for your application.' },
                    { icon: Wrench, title: 'Custom Solutions', desc: 'Learn about our custom extraction capabilities and how we can develop tailored ingredients for your specific needs.' },
                    { icon: ShieldCheck, title: 'Quality Assurance', desc: 'Discover our rigorous quality control processes and how we ensure consistent, high-quality extracts batch after batch.' },
                    { icon: Handshake, title: 'Partnership Opportunities', desc: 'Explore potential collaboration opportunities, from contract manufacturing to exclusive distribution arrangements.' },
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

              {/* Meeting Request Process */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-5">Meeting Request Process</h3>
                <div className="relative">
                  <div className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-[#214842]/15"></div>
                  {[
                    'Submit your meeting request using the form on this page',
                    'Our team will review your request within 1-2 business days',
                    'We\'ll contact you to confirm availability and schedule a specific time',
                    'You\'ll receive a calendar invitation with meeting details',
                    'Meet with our team at the designated booth or meeting area',
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
                    Meeting requests are subject to availability. We recommend submitting your request at least two weeks before the event to ensure we can accommodate your preferred time.
                  </p>
                </div>
              </div>

              {/* Can't Attend an Event? */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <MessageSquare className="h-8 w-8 text-[#258F67] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-[#214842] mb-2">Can&apos;t Attend an Event?</h3>
                <p className="text-xs text-gray-600 mb-4">
                  If you&apos;re unable to meet us at an industry event, we&apos;re still happy to connect with you. You can:
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-5 text-xs text-gray-700">
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Request a virtual meeting</span>
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Contact our sales team directly</span>
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Request product samples</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" className="bg-[#214842] hover:bg-[#1a3a35] text-white w-full">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842]/5 w-full">
                    <Link href="/request-sample">Request Sample</Link>
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
