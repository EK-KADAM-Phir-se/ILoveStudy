"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

// We define the shape of our params object
interface PageProps {
  params: {
    year: string;
  };
}

export default function YearWorkspacePage({ params }: PageProps) {
  const router = useRouter();
  
  // Next.js magically extracts the year from the URL!
  const currentYear = params.year; 

  return (
    <div className="p-8">
      <button 
        onClick={() => router.push('/dashboard/jee-mains?type=mains')} 
        className="text-blue-600 mb-6 font-bold"
      >
        &larr; Back to Years List
      </button>

      <h1 className="text-3xl font-extrabold text-gray-800">
        JEE Mains - {currentYear} Workspace
      </h1>
      <p className="mt-2 text-gray-600">
        This single file handles every year automatically!
      </p>
    </div>
  );
}