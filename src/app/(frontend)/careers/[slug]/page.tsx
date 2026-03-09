import { notFound } from 'next/navigation';
import Image from '@/components/ui/image';
import { getPayloadClient } from '@/lib/payload';
import { mapJob } from '@/lib/mappers';
import { Briefcase, MapPin, Clock, Calendar } from 'lucide-react';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import JobDetailClient from '@/components/careers/JobDetailClient';
import { formatDate } from '@/utils/date';

// Set dynamic to force-static for static export
export const dynamic = 'force-static';

// Generate static params for all job openings
export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 100,
    select: { slug: true }
  });
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  // Find the job based on the slug
  const { docs } = await payload.find({
    collection: 'jobs',
    where: { slug: { equals: slug } },
    limit: 1
  });
  const job = docs[0] ? mapJob(docs[0]) : null;

  // If job not found, return 404
  if (!job) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="/images/hero/standardized-herbal-extracts.jpeg"
          alt={job.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">{job.title}</h1>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Careers', href: '/careers' },
              { label: job.title, href: `/careers/${job.slug}`, isCurrent: true },
            ]}
          />
        </div>
      </section>

      {/* Job Details Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-1">
              <Briefcase size={18} className="text-[#258F67]" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={18} className="text-[#258F67]" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={18} className="text-[#258F67]" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={18} className="text-[#258F67]" />
              <span>Posted: {formatDate(job.postedAt)}</span>
            </div>
          </div>

          {/* Pass the job data to the client component */}
          <JobDetailClient job={job} />
        </div>
      </section>
    </>
  );
}
