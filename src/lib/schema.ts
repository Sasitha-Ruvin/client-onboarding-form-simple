import { z } from 'zod';

// Service options enum for better type safety
export const ServiceOption = {
  UI_UX: 'UI/UX',
  BRANDING: 'Branding',
  WEB_DEV: 'Web Dev',
  MOBILE_APP: 'Mobile App',
} as const;

export const serviceOptions = Object.values(ServiceOption);

// Zod schema for client onboarding form
export const onboardingSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must be at most 80 characters')
    .regex(
      /^[a-zA-Z\s''-]+$/,
      'Full name can only contain letters, spaces, apostrophes, and hyphens'
    ),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be at most 100 characters'),
  
  services: z
    .array(z.enum([ServiceOption.UI_UX, ServiceOption.BRANDING, ServiceOption.WEB_DEV, ServiceOption.MOBILE_APP]))
    .min(1, 'Please select at least one service'),
  
  budgetUsd: z
    .number()
    .int('Budget must be a whole number')
    .min(100, 'Budget must be at least $100')
    .max(1000000, 'Budget must be at most $1,000,000')
    .optional(),
  
  projectStartDate: z
    .string()
    .min(1, 'Project start date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Project start date must be today or later'),
  
  acceptTerms: z
    .boolean()
    .refine((value) => value === true, 'You must accept the terms and conditions'),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Transform data for API submission
export const transformFormData = (data: OnboardingFormData) => {
  return {
    ...data,
    budgetUsd: data.budgetUsd || undefined,
  };
}; 