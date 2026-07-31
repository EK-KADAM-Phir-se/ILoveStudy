"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import the router hook
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

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

      localStorage.setItem('token', data.token);
      localStorage.setItem('displayName', email.split('@')[0]);
      router.push('/pages/dashboard');

    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('displayName', userCredential.user.displayName || userCredential.user.email.split('@')[0]);
      router.push('/pages/dashboard');
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window closed before completion.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Popup request was cancelled.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 w-full text-sm"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 w-full text-sm"
          required
        />

        {/* Conditionally show Confirm Password if registering */}
        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 w-full text-sm"
            required
          />
        )}

        <button 
          type="submit" 
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer text-sm"
        >
          {isRegistering ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <div className="flex items-center my-5">
        <div className="flex-grow border-t border-slate-800"></div>
        <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider font-semibold">or</span>
        <div className="flex-grow border-t border-slate-800"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center bg-slate-900 text-slate-300 border border-slate-800 p-3 rounded-lg hover:bg-slate-850 hover:text-white hover:border-slate-700 transition-all duration-200 font-medium text-sm shadow-sm active:scale-[0.98] cursor-pointer transform hover:-translate-y-0.5 gap-2"
      >
        <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 0, 0)">
            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4c0,-0.66 -0.06,-1.3 -0.18,-1.97z" fill="#4285F4" />
            <path d="M12,20.65c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.9,0.6 -2.07,0.98 -3.3,0.98c-2.34,0 -4.33,-1.58 -5.04,-3.7H2.9v2.66c1.49,2.96 4.54,4.81 8.1,4.81z" fill="#34A853" />
            <path d="M6.96,13.18a5.2,5.2,0,0,1,0,-3.36V7.16H2.9a8.65,8.65,0,0,0,0,8.68l4.06,-2.66z" fill="#FBBC05" />
            <path d="M12,7.35c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58c-1.57,-1.46 -3.61,-2.35 -6.02,-2.35c-3.56,0 -6.61,1.85 -8.1,4.81l4.06,3.16c0.71,-2.12 2.7,-3.7 5.04,-3.7z" fill="#EA4335" />
          </g>
        </svg>
        Sign in with Google
      </button>

      <div className="text-center mt-5">
        <button
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm font-semibold transition cursor-pointer"
        >
          {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;