'use client';

import { useState } from 'react';
import Link from 'next/link';
import { JobOpening } from '@/data/types';
import { Briefcase, MapPin, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralApplicationForm from '@/components/careers/GeneralApplicationForm';

interface CareersPageClientProps {
  departments: string[];
  jobOpenings: JobOpening[];
}

export default function CareersPageClient({ departments, jobOpenings }: CareersPageClientProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Filter jobs by department
  const filteredJobs = selectedDepartment === 'all'
    ? jobOpenings
    : jobOpenings.filter(job => job.department === selectedDepartment);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      {/* Current Openings Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Opportunities</h6>
            <h2 className="text-[#214842] mb-4">Current Openings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our current job opportunities and find a role where you can contribute your talents and grow your career.
            </p>
          </div>

          {/* Department Filters */}
          <div className="mb-8">
            <Tabs defaultValue="all" onValueChange={setSelectedDepartment}>
              <TabsList className="mb-8 flex flex-wrap justify-center">
                {departments.map((dept) => (
                  <TabsTrigger key={dept} value={dept} className="capitalize">
                    {dept === 'all' ? 'All Departments' : dept}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Job Listings */}
          <div className="grid gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-[#214842] mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Briefcase size={16} />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>Posted: {formatDate(job.postedDate)}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button asChild className="bg-[#214842] hover:bg-[#1a3a35]">
                          <Link href={`/careers/${job.slug}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600">No job openings found in this department at the moment.</p>
                <p className="mt-2">Please check back later or submit a general application.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* General Application Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Join Our Talent Pool</h6>
            <h2 className="text-[#214842] mb-4">General Application</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don&apos;t see a position that matches your skills? Submit a general application and we&apos;ll keep your resume on file for future opportunities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
            <GeneralApplicationForm />
          </div>
        </div>
      </section>
    </>
  );
}
