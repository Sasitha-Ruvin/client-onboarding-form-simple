'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onboardingSchema, type OnboardingFormData, serviceOptions, transformFormData } from '@/lib/schema';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

interface SubmissionState {
  type: 'error' | null;
  message: string;
}

export function OnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    type: null,
    message: '',
  });
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      services: [],
      budgetUsd: undefined,
      projectStartDate: '',
      acceptTerms: false,
    },
  });

  // Pre-fill form from query parameters 
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && serviceOptions.includes(serviceParam as (typeof serviceOptions)[number])) {
      setValue('services', [serviceParam as (typeof serviceOptions)[number]]);
    }

    const emailParam = searchParams.get('email');
    if (emailParam) {
      setValue('email', emailParam);
    }

    const companyParam = searchParams.get('company');
    if (companyParam) {
      setValue('companyName', companyParam);
    }
  }, [searchParams, setValue]);

  const todayDate = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    setSubmissionState({ type: null, message: '' });

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_ONBOARD_URL;
      if (!apiEndpoint) {
        throw new Error('API endpoint not configured');
      }

      const transformedData = transformFormData(data);
      
      const response = await axios.post(apiEndpoint, transformedData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Your onboarding request has been submitted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#4CAF50',
          customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            icon: 'swal-icon',
            confirmButton: 'swal-confirm-button',
          },
        });
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          errorMessage = `Server error (${error.response.status}): ${
            error.response.data?.message || 'Please try again later.'
          }`;
        } else if (error.request) {
          // Network error
          errorMessage = 'Network error: Please check your connection and try again.';
        } else if (error.code === 'ECONNABORTED') {
          // Timeout
          errorMessage = 'Request timeout: Please try again.';
        }
      }

      setSubmissionState({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedServices = watch('services');

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Client Onboarding
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let&apos;s get started with your project. Please fill out the information below.
          </p>
        </div>

        {/* Error Messages Only */}
        {submissionState.type === 'error' && (
          <div
            className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
            role="alert"
            aria-live="assertive"
          >
            <div className="text-sm text-red-800 dark:text-red-200">
              {submissionState.message}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Full Name */}
          <FormField
            label="Full Name"
            error={errors.fullName?.message}
            required
            htmlFor="fullName"
          >
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="Enter your full name"
              error={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
          </FormField>

          {/* Email */}
          <FormField
            label="Email Address"
            error={errors.email?.message}
            required
            htmlFor="email"
          >
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email address"
              error={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </FormField>

          {/* Company Name */}
          <FormField
            label="Company Name"
            error={errors.companyName?.message}
            required
            htmlFor="companyName"
          >
            <Input
              id="companyName"
              {...register('companyName')}
              placeholder="Enter your company name"
              error={!!errors.companyName}
              aria-describedby={errors.companyName ? 'companyName-error' : undefined}
            />
          </FormField>

          {/* Services */}
          <FormField
            label="Services Interested In"
            error={errors.services?.message}
            required
          >
            <div className="space-y-3" role="group" aria-labelledby="services-label">
              {serviceOptions.map((service) => (
                <Checkbox
                  key={service}
                  id={`service-${service}`}
                  label={service}
                  {...register('services')}
                  value={service}
                  checked={watchedServices?.includes(service)}
                  error={!!errors.services}
                />
              ))}
            </div>
          </FormField>

          {/* Budget */}
          <FormField
            label="Budget (USD)"
            error={errors.budgetUsd?.message}
            htmlFor="budgetUsd"
          >
            <Input
              id="budgetUsd"
              type="number"
              {...register('budgetUsd', { 
                valueAsNumber: true,
                setValueAs: (value) => value === '' ? undefined : Number(value)
              })}
              placeholder="Enter your budget (100 - 1,000,000)"
              min={100}
              max={1000000}
              error={!!errors.budgetUsd}
              aria-describedby={errors.budgetUsd ? 'budgetUsd-error' : undefined}
            />
          </FormField>

          {/* Project Start Date */}
          <FormField
            label="Project Start Date"
            error={errors.projectStartDate?.message}
            required
            htmlFor="projectStartDate"
          >
            <Input
              id="projectStartDate"
              type="date"
              {...register('projectStartDate')}
              min={todayDate}
              error={!!errors.projectStartDate}
              aria-describedby={errors.projectStartDate ? 'projectStartDate-error' : undefined}
            />
          </FormField>

          {/* Accept Terms */}
          <FormField
            label=""
            error={errors.acceptTerms?.message}
          >
            <Checkbox
              id="acceptTerms"
              {...register('acceptTerms')}
              label="I accept the terms and conditions"
              error={!!errors.acceptTerms}
            />
          </FormField>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Onboarding Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 