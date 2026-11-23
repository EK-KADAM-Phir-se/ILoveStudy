"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { syncUserProfile } from '../../lib/profileApi';
import { clearGuestMode } from '../../lib/authUtils';
import { API_BASE_URL } from '../../lib/apiConfig';

async function safeParseJson(res) {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error(`API endpoint not found (404). Please ensure the backend is active at ${API_BASE_URL}`);
    }
    throw new Error(`Server returned error (${res.status}): ${text.slice(0, 100) || 'Unexpected non-JSON response'}`);
  }
  return res.json();
}

const Login = () => {
  const router = useRouter();

  // Core Auth Navigation State: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'
  const [authMode, setAuthMode] = useState('LOGIN');
  // Login Tab: 'PASSWORD' | 'OTP'
  const [loginTab, setLoginTab] = useState('PASSWORD');

  // Input Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 6-Digit OTP State
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);

  // Flow State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [actionToken, setActionToken] = useState('');
  const [duplicateAccountError, setDuplicateAccountError] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Timers & Status
  const [cooldown, setCooldown] = useState(0);
  const [expiryCountdown, setExpiryCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cooldown countdown effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Expiry countdown effect
  useEffect(() => {
    let timer;
    if (expiryCountdown > 0) {
      timer = setInterval(() => setExpiryCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [expiryCountdown]);

  // Reset OTP state when changing modes
  const resetFormState = () => {
    setError('');
    setSuccessMessage('');
    setOtpSent(false);
    setOtpVerified(false);
    setActionToken('');
    setDuplicateAccountError(false);
    setResetSuccess(false);
    setOtpValues(['', '', '', '', '', '']);
    setExpiryCountdown(0);
  };

  const handleModeSwitch = (mode) => {
    resetFormState();
    setAuthMode(mode);
  };

  const handleLoginTabSwitch = (tab) => {
    resetFormState();
    setLoginTab(tab);
  };

  // -------------------------------------------------------------
  // Session Persistence Helper
  // -------------------------------------------------------------
  const persistSession = async (token, userEmail, displayName, avatarUrl) => {
    clearGuestMode();
    localStorage.setItem('token', token);
    localStorage.setItem('backendToken', token);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('displayName', displayName || userEmail.split('@')[0]);

    try {
      const synced = await syncUserProfile({
        email: userEmail,
        fullName: displayName || userEmail.split('@')[0],
        avatarUrl: avatarUrl || null,
      });
      if (synced?.token) {
        localStorage.setItem('token', synced.token);
        localStorage.setItem('backendToken', synced.token);
      }
    } catch (e) {
      console.warn('Profile sync notice:', e);
    }

    router.push('/pages/dashboard');
  };

  // -------------------------------------------------------------
  // 6-Digit OTP Input Handlers (with auto-focus and paste)
  // -------------------------------------------------------------
  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      const newOtp = [...otpValues];
      newOtp[index] = '';
      setOtpValues(newOtp);
      return;
    }

    if (cleanValue.length === 1) {
      const newOtp = [...otpValues];
      newOtp[index] = cleanValue;
      setOtpValues(newOtp);
      if (index < 5 && otpInputsRef.current[index + 1]) {
        otpInputsRef.current[index + 1].focus();
      }
    } else if (cleanValue.length > 1) {
      // Pasted multiple digits
      const digits = cleanValue.slice(0, 6).split('');
      const newOtp = [...otpValues];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtpValues(newOtp);
      const focusIndex = Math.min(digits.length, 5);
      if (otpInputsRef.current[focusIndex]) {
        otpInputsRef.current[focusIndex].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const getCombinedOtp = () => otpValues.join('');

  // -------------------------------------------------------------
  // 1. Password Login
  // -------------------------------------------------------------
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      await persistSession(data.token, data.user.email, data.user.fullName, data.user.avatarUrl);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 2. Send OTP (Used by OTP Login, Register, Forgot Password)
  // -------------------------------------------------------------
  const handleSendOtp = async (purpose) => {
    setError('');
    setDuplicateAccountError(false);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, purpose }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        if (res.status === 409 && data.code === 'ACCOUNT_EXISTS') {
          setDuplicateAccountError(true);
          setError('An account with this email already exists.');
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Failed to send verification code.');
      }

      setOtpSent(true);
      setCooldown(data.cooldownSeconds || 60);
      setExpiryCountdown(300); // 5 minutes
      setSuccessMessage(`A 6-digit verification code has been sent to ${cleanEmail}`);
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    } catch (err) {
      setError(err.message || 'Error sending code.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 3. Verify OTP for Login Flow
  // -------------------------------------------------------------
  const handleOtpLoginVerify = async (e) => {
    e.preventDefault();
    const otp = getCombinedOtp();
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setError('');
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp, purpose: 'LOGIN' }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      await persistSession(data.token, data.user.email, data.user.fullName, data.user.avatarUrl);
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 4. Registration Flow
  // -------------------------------------------------------------
  const handleRegisterSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setDuplicateAccountError(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    await handleSendOtp('REGISTRATION');
  };

  const handleRegisterVerifyAndSubmit = async (e) => {
    e.preventDefault();
    const otp = getCombinedOtp();
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setError('');
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = fullName.trim() || cleanEmail.split('@')[0];

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: cleanFullName,
          email: cleanEmail,
          password,
          otp,
        }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        if (res.status === 409) {
          setDuplicateAccountError(true);
        }
        throw new Error(data.error || 'Registration failed.');
      }

      await persistSession(data.token, data.user.email, data.user.fullName, null);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 5. Forgot Password & Reset Flow
  // -------------------------------------------------------------
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    await handleSendOtp('PASSWORD_RESET');
  };

  const handleForgotVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = getCombinedOtp();
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setError('');
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp, purpose: 'PASSWORD_RESET' }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      setActionToken(data.actionToken);
      setOtpVerified(true);
      setSuccessMessage('Code verified! Please enter your new password.');
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          newPassword,
          actionToken,
          otp: getCombinedOtp(),
        }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setResetSuccess(true);
      setSuccessMessage('Password successfully updated! You can now log in.');
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 6. Existing Google Sign-In (Preserved Firebase Implementation)
  // -------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;
      const userEmail = firebaseUser.email;
      const displayName = firebaseUser.displayName || userEmail.split('@')[0];

      // Sync Google user with backend & obtain backend JWT
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

        const syncData = await safeParseJson(syncRes);

        if (syncRes.ok && syncData.token) {
          await persistSession(syncData.token, userEmail, syncData.user?.fullName || displayName, firebaseUser.photoURL);
          return;
        }
      } catch (syncErr) {
        console.warn('Backend Google Sync fallback:', syncErr);
      }

      // Fallback Firebase ID Token
      const token = await userCredential.user.getIdToken();
      await persistSession(token, userEmail, displayName, firebaseUser.photoURL);
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window closed before completion.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Popup request was cancelled.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper format for 5-minute expiry countdown
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // -------------------------------------------------------------
  // RENDER: 6-Digit OTP Boxes Component
  // -------------------------------------------------------------
  const renderOtpBoxes = () => (
    <div className="flex flex-col items-center my-4 space-y-3">
      <div className="flex justify-between gap-2 w-full max-w-xs">
        {otpValues.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => (otpInputsRef.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={val}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
            className="w-11 h-13 text-center text-xl font-bold bg-slate-950/90 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white rounded-lg transition-all"
            autoFocus={idx === 0}
          />
        ))}
      </div>

      <div className="flex items-center justify-between w-full max-w-xs text-xs px-1">
        {expiryCountdown > 0 ? (
          <span className="text-slate-400">
            Expires in <span className="text-indigo-400 font-semibold">{formatTime(expiryCountdown)}</span>
          </span>
        ) : (
          <span className="text-amber-400">Code expired</span>
        )}

        <button
          type="button"
          disabled={cooldown > 0 || loading}
          onClick={() => handleSendOtp(authMode === 'REGISTER' ? 'REGISTRATION' : authMode === 'FORGOT_PASSWORD' ? 'PASSWORD_RESET' : 'LOGIN')}
          className="text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ERROR BANNER */}
      {error && !duplicateAccountError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium text-center mb-4">
          {error}
        </div>
      )}

      {/* SUCCESS BANNER */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm font-medium text-center mb-4">
          {successMessage}
        </div>
      )}

      {/* ========================================================= */}
      {/* DUPLICATE ACCOUNT ALERT BANNER (with instant login options) */}
      {/* ========================================================= */}
      {duplicateAccountError && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl text-center mb-4 space-y-3">
          <p className="font-semibold text-sm">An account with this email already exists.</p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                setDuplicateAccountError(false);
                setError('');
                setAuthMode('LOGIN');
                setLoginTab('PASSWORD');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-lg transition cursor-pointer"
            >
              Login with Password
            </button>
            <button
              type="button"
              onClick={() => {
                setDuplicateAccountError(false);
                setError('');
                setAuthMode('LOGIN');
                setLoginTab('OTP');
                setOtpSent(false);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold py-2 px-3 rounded-lg transition cursor-pointer"
            >
              Login with OTP
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 1: MAIN LOGIN */}
      {/* ========================================================= */}
      {authMode === 'LOGIN' && (
        <div>
          {/* Segmented Tab Selector */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => handleLoginTabSwitch('PASSWORD')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                loginTab === 'PASSWORD'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => handleLoginTabSwitch('OTP')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                loginTab === 'OTP'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Email OTP Login
            </button>
          </div>

          {/* TAB 1: Password Login */}
          {loginTab === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 pr-10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('FORGOT_PASSWORD')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer text-sm"
              >
                {loading ? 'Signing In...' : 'Sign In with Password'}
              </button>
            </form>
          )}

          {/* TAB 2: Email OTP Login */}
          {loginTab === 'OTP' && (
            <div>
              {!otpSent ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendOtp('LOGIN');
                  }}
                  className="flex flex-col space-y-4"
                >
                  <p className="text-slate-400 text-xs">
                    Enter your registered email to receive a secure 6-digit one-time login code.
                  </p>
                  <input
                    type="email"
                    placeholder="Registered Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading || cooldown > 0}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer text-sm"
                  >
                    {loading ? 'Sending Code...' : 'Send Login Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpLoginVerify} className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Code sent to <b className="text-slate-200">{email}</b></span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-indigo-400 hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {renderOtpBoxes()}

                  <button
                    type="submit"
                    disabled={loading || getCombinedOtp().length !== 6}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] cursor-pointer text-sm"
                  >
                    {loading ? 'Verifying...' : 'Verify & Log In'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider font-semibold">or</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Google Sign-In (Preserved Firebase) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center bg-slate-900 text-slate-300 border border-slate-800 p-3 rounded-lg hover:bg-slate-850 hover:text-white hover:border-slate-700 disabled:opacity-60 transition-all duration-200 font-medium text-sm shadow-sm active:scale-[0.98] cursor-pointer transform hover:-translate-y-0.5 gap-2 mb-4"
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

          {/* Switch to Register */}
          <div className="text-center pt-2">
            <span className="text-slate-400 text-xs">Don't have an account? </span>
            <button
              type="button"
              onClick={() => handleModeSwitch('REGISTER')}
              className="text-indigo-400 hover:text-indigo-300 hover:underline text-xs font-semibold transition cursor-pointer"
            >
              Register now
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: REGISTRATION WITH OTP VERIFICATION */}
      {/* ========================================================= */}
      {authMode === 'REGISTER' && (
        <div>
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-slate-100">Create Student Account</h2>
            <p className="text-slate-400 text-xs mt-1">Join thousands preparing with ILoveStudy</p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleRegisterSendOtp} className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 pr-10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 pr-10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] cursor-pointer text-sm mt-2"
              >
                {loading ? 'Validating...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterVerifyAndSubmit} className="flex flex-col space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Enter code sent to <b className="text-slate-200">{email}</b></span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-indigo-400 hover:underline cursor-pointer"
                >
                  Edit Details
                </button>
              </div>

              {renderOtpBoxes()}

              <button
                type="submit"
                disabled={loading || getCombinedOtp().length !== 6}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] cursor-pointer text-sm"
              >
                {loading ? 'Creating Account...' : 'Verify OTP & Complete Registration'}
              </button>
            </form>
          )}

          {/* Switch to Login */}
          <div className="text-center pt-4">
            <span className="text-slate-400 text-xs">Already have an account? </span>
            <button
              type="button"
              onClick={() => handleModeSwitch('LOGIN')}
              className="text-indigo-400 hover:text-indigo-300 hover:underline text-xs font-semibold transition cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 3: FORGOT PASSWORD & RESET */}
      {/* ========================================================= */}
      {authMode === 'FORGOT_PASSWORD' && (
        <div>
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-slate-100">Reset Your Password</h2>
            <p className="text-slate-400 text-xs mt-1">
              Verify your email to create a new password
            </p>
          </div>

          {resetSuccess ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-slate-300 text-sm">Your password has been reset successfully!</p>
              <button
                type="button"
                onClick={() => {
                  handleModeSwitch('LOGIN');
                  setLoginTab('PASSWORD');
                }}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-lg transition text-sm cursor-pointer"
              >
                Sign In with New Password
              </button>
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleForgotSendOtp} className="flex flex-col space-y-4">
              <p className="text-slate-400 text-xs">
                Enter your registered email address and we'll send you a password reset code.
              </p>
              <input
                type="email"
                placeholder="Account Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                required
              />

              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition cursor-pointer text-sm"
              >
                {loading ? 'Sending Code...' : 'Send Reset Code'}
              </button>
            </form>
          ) : !otpVerified ? (
            <form onSubmit={handleForgotVerifyOtp} className="flex flex-col space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Code sent to <b className="text-slate-200">{email}</b></span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-indigo-400 hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              {renderOtpBoxes()}

              <button
                type="submit"
                disabled={loading || getCombinedOtp().length !== 6}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition cursor-pointer text-sm"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit} className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 pr-10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 p-3 pr-10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 w-full text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition cursor-pointer text-sm"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => handleModeSwitch('LOGIN')}
              className="text-slate-400 hover:text-slate-200 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
