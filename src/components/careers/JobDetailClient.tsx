'use client';

import { useState } from 'react';
import Link from 'next/link';
import { JobOpening } from '@/data/types';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobApplicationForm from '@/components/careers/JobApplicationForm';

interface JobDetailClientProps {
  job: JobOpening;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 mb-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Job Description</h3>
              <p className="text-gray-700 mb-4">{job.description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Key Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 size={20} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 size={20} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Qualifications</h3>
              <ul className="space-y-2">
                {job.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 size={20} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>{qualification}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 size={20} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                className="bg-[#214842] hover:bg-[#1a3a35]"
                onClick={() => setShowApplicationForm(true)}
              >
                Apply for this Position
              </Button>
              <Button variant="outline" asChild>
                <Link href="/careers" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Back to All Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
            <h3 className="text-xl font-semibold text-[#214842] mb-4">About Star Hi Herbs</h3>
            <p className="text-gray-700 mb-4">
              Star Hi Herbs is a leading manufacturer of premium herbal extracts, probiotics, and nutraceutical solutions. With state-of-the-art facilities in Bangalore and Hassan, we combine traditional knowledge with modern science to create innovative products for global markets.
            </p>
            <p className="text-gray-700">
              Our team consists of passionate professionals dedicated to quality, innovation, and sustainability. Join us to be part of a company that's making a positive impact on global health.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h3 className="text-xl font-semibold text-[#214842] mb-4">Share This Job</h3>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="flex-1">
                LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Email
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Section */}
      {showApplicationForm && (
        <section className="section-padding bg-gray-50 mt-12">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-[#214842] mb-4">Apply for {job.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Please fill out the form below to apply for this position. All fields marked with an asterisk (*) are required.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
              <JobApplicationForm jobTitle={job.title} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
