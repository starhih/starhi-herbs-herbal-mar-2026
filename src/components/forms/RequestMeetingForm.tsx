'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { handleError, logError } from '@/utils/error-handling';

interface MeetingEvent {
  id: string | number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  city: string;
  country: string;
  boothNumber?: string;
  upcoming: boolean;
}

interface RequestMeetingFormProps {
  events: MeetingEvent[];
}

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  jobTitle: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(6, { message: 'Please enter a valid phone number' }),
  country: z.string().min(2, { message: 'Please enter your country or region' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  websiteUrl: z.string().optional(),
  eventId: z.string().min(1, { message: 'Please select an event' }),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  meetingTopics: z.string().optional(),
  comments: z.string().min(10, { message: 'Please provide details about your request' }),
});

type FormData = z.infer<typeof formSchema>;

export default function RequestMeetingForm({ events }: RequestMeetingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  // Filter only upcoming events
  const upcomingEvents = events.filter(event => event.upcoming);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      jobTitle: '',
      email: '',
      phone: '',
      country: '',
      companyName: '',
      websiteUrl: '',
      eventId: '',
      preferredDate: '',
      preferredTime: '',
      meetingTopics: '',
      comments: '',
    },
  });

  // Watch the eventId field to update the selected event
  const watchEventId = watch('eventId');

  // Handle event selection
  const handleEventChange = (value: string) => {
    setValue('eventId', value);
    setSelectedEvent(value);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get the selected event details for the email
      const selectedEventDetails = upcomingEvents.find(event => event.id.toString() === data.eventId);

      // Prepare data for email with event details
      const emailData = {
        ...data,
        eventName: selectedEventDetails?.name || 'Unknown Event',
        eventLocation: selectedEventDetails?.location || 'Unknown Location',
        eventDates: selectedEventDetails ?
          `${new Date(selectedEventDetails.startDate).toLocaleDateString()} - ${new Date(selectedEventDetails.endDate).toLocaleDateString()}` :
          'Unknown Dates'
      };

      const { sendMeetingRequestEmail } = await import('@/lib/email-service');
      const result = await sendMeetingRequestEmail(emailData);

      if (result.success) {
        setSubmitSuccess(true);
        reset();
        setSelectedEvent('');
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(result.error || 'Failed to submit the form');
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Failed to submit the form. Please try again.');
      setSubmitError(errorMessage);
      logError(errorMessage, 'RequestMeetingForm', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the selected event details
  const selectedEventDetails = upcomingEvents.find(event => event.id.toString() === watchEventId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <p>Thank you for your meeting request! Our team will contact you shortly to confirm the details.</p>
        </div>
      )}

      {/* Error message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{submitError}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-[#214842]">Personal Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="First name"
            className={errors.firstName ? 'border-red-300' : ''}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Last name"
            className={errors.lastName ? 'border-red-300' : ''}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
            Job Title
          </label>
          <Input
            id="jobTitle"
            {...register('jobTitle')}
            placeholder="Your job title"
          />
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
            placeholder="your@email.com"
            className={errors.email ? 'border-red-300' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+1 234 567 8900"
            className={errors.phone ? 'border-red-300' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Country/Region */}
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium text-gray-700">
            Country/Region <span className="text-red-500">*</span>
          </label>
          <Input
            id="country"
            {...register('country')}
            placeholder="Your country or region"
            className={errors.country ? 'border-red-300' : ''}
          />
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
          )}
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Company Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="companyName"
            {...register('companyName')}
            placeholder="Company name"
            className={errors.companyName ? 'border-red-300' : ''}
          />
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
          )}
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
            Website URL
          </label>
          <Input
            id="websiteUrl"
            {...register('websiteUrl')}
            placeholder="example.com"
          />
        </div>
      </div>

      {/* Meeting Information */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Meeting Information</h3>
      </div>

      {/* Event Selection */}
      <div className="space-y-2">
        <label htmlFor="eventId" className="text-sm font-medium text-gray-700">
          Which event would you like to meet us at? <span className="text-red-500">*</span>
        </label>
        <Select onValueChange={handleEventChange} value={selectedEvent}>
          <SelectTrigger className={errors.eventId ? 'border-red-300' : ''}>
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {upcomingEvents.map((event) => (
              <SelectItem key={event.id} value={event.id.toString()}>
                {event.name} ({new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.eventId && (
          <p className="text-red-500 text-xs mt-1">{errors.eventId.message}</p>
        )}
      </div>

      {selectedEventDetails && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-[#214842] mb-2">Event Details</h4>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Location:</span> {selectedEventDetails.location}, {selectedEventDetails.city}, {selectedEventDetails.country}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Dates:</span> {new Date(selectedEventDetails.startDate).toLocaleDateString()} - {new Date(selectedEventDetails.endDate).toLocaleDateString()}
          </p>
          {selectedEventDetails.boothNumber && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Booth Number:</span> {selectedEventDetails.boothNumber}
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Preferred Date */}
        <div className="space-y-2">
          <label htmlFor="preferredDate" className="text-sm font-medium text-gray-700">
            Preferred Meeting Date
          </label>
          <Input
            id="preferredDate"
            type="date"
            {...register('preferredDate')}
            min={selectedEventDetails?.startDate}
            max={selectedEventDetails?.endDate}
          />
        </div>

        {/* Preferred Time */}
        <div className="space-y-2">
          <label htmlFor="preferredTime" className="text-sm font-medium text-gray-700">
            Preferred Meeting Time
          </label>
          <Select onValueChange={(value) => setValue('preferredTime', value)}>
            <SelectTrigger>
              <SelectValue placeholder="--:-- --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9:00 AM">9:00 AM</SelectItem>
              <SelectItem value="9:30 AM">9:30 AM</SelectItem>
              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
              <SelectItem value="10:30 AM">10:30 AM</SelectItem>
              <SelectItem value="11:00 AM">11:00 AM</SelectItem>
              <SelectItem value="11:30 AM">11:30 AM</SelectItem>
              <SelectItem value="12:00 PM">12:00 PM</SelectItem>
              <SelectItem value="12:30 PM">12:30 PM</SelectItem>
              <SelectItem value="1:00 PM">1:00 PM</SelectItem>
              <SelectItem value="1:30 PM">1:30 PM</SelectItem>
              <SelectItem value="2:00 PM">2:00 PM</SelectItem>
              <SelectItem value="2:30 PM">2:30 PM</SelectItem>
              <SelectItem value="3:00 PM">3:00 PM</SelectItem>
              <SelectItem value="3:30 PM">3:30 PM</SelectItem>
              <SelectItem value="4:00 PM">4:00 PM</SelectItem>
              <SelectItem value="4:30 PM">4:30 PM</SelectItem>
              <SelectItem value="5:00 PM">5:00 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meeting Topics */}
      <div className="space-y-2">
        <label htmlFor="meetingTopics" className="text-sm font-medium text-gray-700">
          Meeting Topics
        </label>
        <Input
          id="meetingTopics"
          {...register('meetingTopics')}
          placeholder="Specify key topics, products, or discussion points"
        />
      </div>

      {/* Additional Comments */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Additional Comments</h3>
      </div>
      <div className="space-y-2">
        <label htmlFor="comments" className="text-sm font-medium text-gray-700">
          Comments <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="comments"
          {...register('comments')}
          placeholder="Tell us more about your request or let us know the ingredients you are interested in."
          className={`min-h-[100px] ${errors.comments ? 'border-red-300' : ''}`}
        />
        {errors.comments && (
          <p className="text-red-500 text-xs mt-1">{errors.comments.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#214842] hover:bg-[#1a3a35] text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Meeting Request'}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By submitting this form, you agree to our privacy policy. We will review your request and respond within 1-2 business days.
      </p>
    </form>
  );
}
