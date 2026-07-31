"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import the router hook

const Login = () => {
  const router = useRouter(); // 2. Initialize the router
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // [Keep your email and password validation rules here]

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isRegistering }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // 👇 PLACE THE NEW CODE RIGHT HERE! 👇
     localStorage.setItem('token', data.token);
router.push('/dashboard'); // Changed target to a clean core dashboard!
      
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}

        <input 
          type="text" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="border p-2 rounded text-black w-full"
          required
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className="border p-2 rounded text-black w-full"
          required
        />

        {/* Conditionally show Confirm Password if registering */}
        {isRegistering && (
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="border p-2 rounded text-black w-full"
            required
          />
        )}

        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          {isRegistering ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-4">
        <button 
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          className="text-blue-600 hover:underline text-sm"
        >
          {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;