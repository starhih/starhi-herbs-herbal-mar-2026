import { notFound } from 'next/navigation';
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

  // Map departments to specific colors
  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      'Research & Development': 'bg-[#1e40af]', // blue-800
      'Production': 'bg-[#b45309]', // amber-700
      'Quality Control': 'bg-[#0f766e]', // teal-700
      'Sales & Marketing': 'bg-[#6d28d9]', // violet-700
      'Supply Chain': 'bg-[#0369a1]', // sky-700
      'Administration': 'bg-[#475569]', // slate-600
    };
    return colors[dept] || 'bg-[#214842]'; // Default Star Hi Green
  };

  const bgColorClass = getDepartmentColor(job.department);

  return (
    <>
      {/* Hero Section */}
      <section className={`${bgColorClass} pt-32 pb-16 md:pt-40 md:pb-24`}>
        <div className="container-custom text-white">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              {job.department}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{job.title}</h1>
            <p className="text-lg text-white/90">
              Join our {job.department.toLowerCase()} team and help us make a difference.
            </p>
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
