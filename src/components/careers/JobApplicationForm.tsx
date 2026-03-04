'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  experience: z.string().min(1, { message: 'Please enter your years of experience' }),
  coverLetter: z.string().min(50, { message: 'Cover letter must be at least 50 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

interface JobApplicationFormProps {
  jobTitle: string;
}

export default function JobApplicationForm({ jobTitle }: JobApplicationFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      experience: '',
      coverLetter: '',
    },
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);

    if (!selectedFile) {
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError('Please upload a PDF or Word document');
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
  };

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    // Validate file
    if (!file) {
      setFileError('Please upload your resume/CV');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert file to base64 for email sending
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      // Prepare data for email
      const emailData = {
        ...data,
        jobTitle,
        resumeFileName: file.name,
        resumeFileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        resumeFileType: file.type,
        resumeFileBase64: fileBase64
      };

      // Import the email service dynamically to avoid SSR issues
      const { sendJobApplicationEmail } = await import('@/lib/email-service');

      // Send the email
      const result = await sendJobApplicationEmail(emailData);

      if (result.success) {
        setIsSubmitted(true);
        form.reset();
        setFile(null);
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFileError('There was a problem submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-50 text-green-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
          <p>Thank you for applying for the {jobTitle} position at Star Hi Herbs.</p>
          <p className="mt-2">We will review your application and contact you soon.</p>
        </div>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3 years in quality control" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel htmlFor="resume">Resume/CV *</FormLabel>
          <div className="mt-1">
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  id="resume"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <label
                  htmlFor="resume"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Click to upload</span>
                  <span className="text-xs text-gray-500 mt-1">PDF or Word (max 5MB)</span>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3 text-sm">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {fileError && <p className="text-sm text-red-500 mt-1">{fileError}</p>}
          </div>
        </div>

        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us why you're interested in this position and what makes you a good fit"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#214842] hover:bg-[#1a3a35]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </form>
    </Form>
  );
}
