import { Suspense } from 'react';
import { OnboardingForm } from '@/components/OnboardingForm';

function OnboardingFormWrapper() {
  return <OnboardingForm />;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <Suspense fallback={
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="space-y-6">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }>
          <OnboardingFormWrapper />
        </Suspense>
        </div>
      </main>
  );
}
