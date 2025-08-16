# Client Onboarding Form

A Next.js client onboarding form with React Hook Form and Zod validation.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_ONBOARD_URL=https://jsonplaceholder.typicode.com/posts
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## RHF + Zod Integration

The form uses React Hook Form with Zod validation through `@hookform/resolvers/zod`:

```typescript
// Schema definition with Zod
const onboardingSchema = z.object({
  fullName: z.string().min(2).max(80).regex(/^[a-zA-Z\s'-]+$/),
  email: z.string().email(),
  companyName: z.string().min(2).max(100),
  services: z.array(z.enum(['UI/UX', 'Branding', 'Web Dev', 'Mobile App'])).min(1),
  budgetUsd: z.number().int().min(100).max(1000000).optional(),
  projectStartDate: z.string().refine(date => new Date(date) >= new Date()),
  acceptTerms: z.boolean().refine(val => val === true)
});

// Form setup with RHF + Zod resolver
const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm<OnboardingFormData>({
  resolver: zodResolver(onboardingSchema)
});
```

The `zodResolver` automatically validates form data against the Zod schema and provides type-safe error messages.
