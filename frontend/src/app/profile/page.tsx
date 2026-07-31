"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if the token exists when page loads
    const token = localStorage.getItem('token');
    if (!token) {
      // No token found? Send them right back to login!
      router.push('/login');
    } else {
      // In a real app, you'd fetch user details here. For now, let's mock it:
      setUserEmail("Student (Authenticated)");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Profile</h1>
        <p className="text-gray-500 mb-6">{userEmail}</p>
        
        <div className="border-t pt-4 space-y-2 text-left">
          <p className="text-sm font-medium text-gray-700">Course: Mechatronics Engineering</p>
          <p className="text-sm font-medium text-gray-700">Portal Access: Active Exam Candidate</p>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}