"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { syncUserProfile } from '../../lib/profileApi';
import { enableGuestMode, clearGuestMode } from '../../lib/authUtils';
import { API_BASE_URL } from '../../lib/apiConfig';

const Login = () => {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const persistSession = async (firebaseUser, token) => {
    clearGuestMode();
    const userEmail = firebaseUser.email;
    if (!userEmail) throw new Error('No email found on account.');

    const displayName = firebaseUser.displayName || userEmail.split('@')[0];

    localStorage.setItem('token', token);
    localStorage.setItem('backendToken', token);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('displayName', displayName);

    const synced = await syncUserProfile({
      email: userEmail,
      fullName: displayName,
      avatarUrl: firebaseUser.photoURL,
    });
    if (synced?.token) {
      localStorage.setItem('token', synced.token);
      localStorage.setItem('backendToken', synced.token);
    }
  };

  // Password Login / Register on Utho Backend
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        const displayName = fullName.trim() || cleanEmail.split('@')[0];

        // 1. Register directly in Utho PostgreSQL Database
        const regRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password, fullName: displayName }),
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
          throw new Error(regData.error || 'Registration failed.');
        }

        // 2. Automatically log in on Utho backend to fetch JWT token
        const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.token) {
          clearGuestMode();
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('backendToken', loginData.token);
          localStorage.setItem('userEmail', cleanEmail);
          localStorage.setItem('displayName', loginData.user?.fullName || displayName);
        }

        // Background sync to Firebase if available
        createUserWithEmailAndPassword(auth, cleanEmail, password).catch(() => {});

        router.push('/pages/dashboard');
        return;
      } else {
        // Logging In directly against Utho Backend
        let uthoLoginSuccess = false;

        try {
          const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, password }),
          });
          const loginData = await loginRes.json();

          if (loginRes.ok && loginData.token) {
            uthoLoginSuccess = true;
            clearGuestMode();
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('backendToken', loginData.token);
            localStorage.setItem('userEmail', cleanEmail);
            localStorage.setItem('displayName', loginData.user?.fullName || cleanEmail.split('@')[0]);

            // Background sync with Firebase
            signInWithEmailAndPassword(auth, cleanEmail, password).catch(() => {});

            router.push('/pages/dashboard');
            return;
          } else if (loginData.error && loginData.error !== "Invalid email or password.") {
            // Specific database message
          }
        } catch (uthoErr) {
          console.warn("Utho direct login notice:", uthoErr);
        }

        // Fallback to Firebase if not found in local Utho DB yet
        if (!uthoLoginSuccess) {
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
          const token = await userCredential.user.getIdToken();
          await persistSession(userCredential.user, token);
          router.push('/pages/dashboard');
          return;
        }
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      let errorMessage = err.message || 'Authentication failed';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;
      const userEmail = firebaseUser.email;
      const displayName = firebaseUser.displayName || userEmail.split('@')[0];

      // Sync Google user directly to Utho backend & obtain standard backend JWT
      try {
        const syncRes = await fetch(`${API_BASE_URL}/api/auth/google-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            fullName: displayName,
            avatarUrl: firebaseUser.photoURL,
          }),
        });
        const syncData = await syncRes.json();

        if (syncRes.ok && syncData.token) {
          clearGuestMode();
          localStorage.setItem('token', syncData.token);
          localStorage.setItem('backendToken', syncData.token);
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('displayName', syncData.user?.fullName || displayName);
          router.push('/pages/dashboard');
          return;
        }
      } catch (syncErr) {
        console.warn("Backend Google Sync note:", syncErr);
      }

      // Fallback session persistence
      const token = await userCredential.user.getIdToken();
      await persistSession(userCredential.user, token);
      router.push('/pages/dashboard');
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window closed before completion.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Popup request was cancelled.');
      } else if (err.message && (err.message.includes('Database is closing') || err.message.includes('hidden'))) {
        setError('Browser database busy. Please click Google Sign-In again to retry.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium text-center mb-4">
          {error}
        </div>
      )}

      {/* PASSWORD AUTH FLOW */}
      <form onSubmit={handlePasswordSubmit} className="flex flex-col space-y-4">
        {isRegistering && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
          required
        />

        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer text-sm"
        >
          {loading ? 'Please wait...' : isRegistering ? 'Sign Up' : 'Sign In'}
        </button>

        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-indigo-400 hover:text-indigo-300 hover:underline text-xs font-semibold transition cursor-pointer"
          >
            {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Register"}
          </button>
        </div>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-slate-800"></div>
        <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider font-semibold">or</span>
        <div className="flex-grow border-t border-slate-800"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center bg-slate-900 text-slate-300 border border-slate-800 p-3 rounded-lg hover:bg-slate-850 hover:text-white hover:border-slate-700 disabled:opacity-60 transition-all duration-200 font-medium text-sm shadow-sm active:scale-[0.98] cursor-pointer transform hover:-translate-y-0.5 gap-2 mb-3"
      >
        <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 0, 0)">
            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4c0,-0.66 -0.06,-1.3 -0.18,-1.97z" fill="#4285F4" />
            <path d="M12,20.65c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.9,0.6 -2.07,0.98 -3.3,0.98c-2.34,0 -4.33,-1.58 -5.04,-3.7H2.9v2.66c1.49,2.96 4.54,4.81 8.1,4.81z" fill="#34A853" />
            <path d="M6.96,13.18a5.2,5.2,0,0,1,0,-3.36V7.16H2.9a8.65,8.65,0,0,0,0,8.68l4.06,-2.66z" fill="#FBBC05" />
            <path d="M12,7.35c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58c-1.57,-1.46 -3.61,-2.35 -6.02,-2.35c-3.56,0 -6.61,1.85 -8.1,4.81l4.06,3.16c0.71,-2.12 2.7,-3.7 5.04,-3.7z" fill="#EA4335" />
          </g>
        </svg>
        Continue with Google
      </button>
    </div>
  );
};

export default Login;