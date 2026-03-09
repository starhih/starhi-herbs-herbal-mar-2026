'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { handleError, logError } from '@/utils/error-handling';
import { Download } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  jobTitle: z.string().min(2, { message: 'Job title must be at least 2 characters' }),
  industry: z.string().min(1, { message: 'Please select your industry' }),
  marketInterest: z.string().min(1, { message: 'Please select your market of interest' }),
  subscribeNewsletter: z.boolean().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions' }),
});

type FormData = z.infer<typeof formSchema>;

export default function DownloadCatalogueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      jobTitle: '',
      industry: '',
      marketInterest: '',
      subscribeNewsletter: true,
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Import the email service dynamically to avoid SSR issues
      const { sendCatalogueRequestEmail } = await import('@/lib/email-service');

      // Send the email
      const result = await sendCatalogueRequestEmail(data);

      if (result.success) {
        // Success
        setSubmitSuccess(true);

        // In a real application, you would redirect to the download or trigger the download here
        // For now, we'll just show a success message with a download link

        // Reset form after successful submission
        reset();

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(result.error || 'Failed to submit the form');
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Failed to submit the form. Please try again.');
      setSubmitError(errorMessage);
      logError(errorMessage, 'DownloadCatalogueForm', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Thank you for your interest!</p>
          <p>Your download should begin automatically. If it doesn't, <a href="#" className="underline font-medium">click here</a> to download.</p>
        </div>
      )}

      {/* Error message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{submitError}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="John Doe"
            className={errors.fullName ? 'border-red-300' : ''}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john.doe@example.com"
            className={errors.email ? 'border-red-300' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium text-gray-700">
            Company <span className="text-red-500">*</span>
          </label>
          <Input
            id="company"
            {...register('company')}
            placeholder="Your Company"
            className={errors.company ? 'border-red-300' : ''}
          />
          {errors.company && (
            <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="jobTitle"
            {...register('jobTitle')}
            placeholder="Product Manager"
            className={errors.jobTitle ? 'border-red-300' : ''}
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>
          )}
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <label htmlFor="industry" className="text-sm font-medium text-gray-700">
            Industry <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue('industry', value)}
            defaultValue=""
          >
            <SelectTrigger className={errors.industry ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
              <SelectItem value="nutraceuticals">Nutraceuticals</SelectItem>
              <SelectItem value="food_beverage">Food & Beverage</SelectItem>
              <SelectItem value="cosmetics">Cosmetics & Personal Care</SelectItem>
              <SelectItem value="dietary_supplements">Dietary Supplements</SelectItem>
              <SelectItem value="research">Research & Development</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>
          )}
        </div>

        {/* Market Interest */}
        <div className="space-y-2">
          <label htmlFor="marketInterest" className="text-sm font-medium text-gray-700">
            Market of Interest <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue('marketInterest', value)}
            defaultValue=""
          >
            <SelectTrigger className={errors.marketInterest ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select your market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north_america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
              <SelectItem value="latin_america">Latin America</SelectItem>
              <SelectItem value="middle_east">Middle East & Africa</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
          {errors.marketInterest && (
            <p className="text-red-500 text-xs mt-1">{errors.marketInterest.message}</p>
          )}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="subscribeNewsletter"
          defaultChecked={true}
          onCheckedChange={(checked) => setValue('subscribeNewsletter', checked as boolean)}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="subscribeNewsletter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Subscribe to our newsletter for product updates and industry insights
          </label>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="termsAccepted"
          onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)}
          className={errors.termsAccepted ? 'border-red-300' : ''}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="termsAccepted"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the terms and conditions <span className="text-red-500">*</span>
          </label>
          {errors.termsAccepted && (
            <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#214842] hover:bg-[#1a3a35] text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <Download className="mr-2 h-5 w-5" />
            Download Catalogue
          </span>
        )}
      </Button>

      <p className="text-xs text-gray-600 text-center mt-4">
        By submitting this form, you agree to our Privacy Policy and Terms of Service.
        We'll use your information to process your download request and contact you about our products.
      </p>
    </form>
  );
}
