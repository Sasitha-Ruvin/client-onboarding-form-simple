import { describe, it, expect } from '@jest/globals';
import { onboardingSchema, ServiceOption } from '@/lib/schema';

describe('Onboarding Schema Validation', () => {
  const validData = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    companyName: 'Acme Corp',
    services: [ServiceOption.UI_UX, ServiceOption.WEB_DEV],
    budgetUsd: 50000,
    projectStartDate: '2025-12-01',
    acceptTerms: true,
  };

  describe('Full Name Validation', () => {
    it('should accept valid full names', () => {
      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept names with apostrophes and hyphens', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        fullName: "Mary O'Connor-Smith",
      });
      expect(result.success).toBe(true);
    });

    it('should reject names shorter than 2 characters', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        fullName: 'J',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('at least 2 characters');
    });

    it('should reject names longer than 80 characters', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        fullName: 'A'.repeat(81),
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('at most 80 characters');
    });

    it('should reject names with invalid characters', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        fullName: 'John123 Doe',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('can only contain letters');
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email addresses', () => {
      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email formats', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('valid email address');
    });

    it('should reject empty email', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        email: '',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('Email is required');
    });
  });

  describe('Company Name Validation', () => {
    it('should accept valid company names', () => {
      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject company names shorter than 2 characters', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        companyName: 'A',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('at least 2 characters');
    });

    it('should reject company names longer than 100 characters', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        companyName: 'A'.repeat(101),
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('at most 100 characters');
    });
  });

  describe('Services Validation', () => {
    it('should accept valid service selections', () => {
      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept single service selection', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        services: [ServiceOption.BRANDING],
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty service array', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        services: [],
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('at least one service');
    });

    it('should reject invalid service options', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        services: ['Invalid Service' as keyof typeof ServiceOption],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Budget Validation', () => {
    it('should accept valid budget amounts', () => {
      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept undefined budget (optional field)', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { budgetUsd: _, ...dataWithoutBudget } = validData;
      const result = onboardingSchema.safeParse(dataWithoutBudget);
      expect(result.success).toBe(true);
    });

    it('should reject budget below minimum', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        budgetUsd: 50,
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('at least $100');
    });

    it('should reject budget above maximum', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        budgetUsd: 2000000,
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('at most $1,000,000');
    });

    it('should reject non-integer budget', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        budgetUsd: 50000.5,
      });
      expect(result.success).toBe(false);
      // The exact error message may vary due to union type handling
      expect(result.error?.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Project Start Date Validation', () => {
    it('should accept future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const result = onboardingSchema.safeParse({
        ...validData,
        projectStartDate: futureDate.toISOString().split('T')[0],
      });
      expect(result.success).toBe(true);
    });

    it('should accept today\'s date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = onboardingSchema.safeParse({
        ...validData,
        projectStartDate: today,
      });
      expect(result.success).toBe(true);
    });

    it('should reject past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const result = onboardingSchema.safeParse({
        ...validData,
        projectStartDate: pastDate.toISOString().split('T')[0],
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('must be today or later');
    });

    it('should reject empty date', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        projectStartDate: '',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('Project start date is required');
    });
  });

  describe('Accept Terms Validation', () => {
    it('should accept when terms are accepted', () => {
      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject when terms are not accepted', () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        acceptTerms: false,
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('must accept the terms');
    });
  });

  describe('Complete Form Validation', () => {
    it('should validate complete valid form', () => {
      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should handle multiple validation errors', () => {
      const invalidData = {
        fullName: 'J',
        email: 'invalid-email',
        companyName: 'A',
        services: [],
        budgetUsd: 50,
        projectStartDate: '2020-01-01',
        acceptTerms: false,
      };
      
      const result = onboardingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });
  });
}); 