'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Forgot password state machine: null | 'email' | 'code' | 'newPassword' | 'done'
  const [resetStep, setResetStep] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        setResetError(data.error || 'Failed to send code');
        return;
      }

      setResetStep('code');
      setResetSuccess('Check your email for the 6-digit code');
    } catch {
      setResetError('Something went wrong');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResetError(data.error || 'Failed to reset password');
        return;
      }

      setResetStep('done');
      setResetSuccess('Password reset successful! You can now sign in.');
    } catch {
      setResetError('Something went wrong');
    } finally {
      setResetLoading(false);
    }
  };

  const exitReset = () => {
    setResetStep(null);
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
    setResetError('');
    setResetSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: '#1A1A1A' }}>
          {resetStep ? 'Reset Password' : 'Admin Login'}
        </h1>

        {/* ─── LOGIN FORM ─── */}
        {!resetStep && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ borderColor: '#E5E5E5' }}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ borderColor: '#E5E5E5' }}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg text-white font-medium text-sm transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#E4002B' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <button
              onClick={() => setResetStep('email')}
              className="w-full mt-3 text-sm font-medium text-center"
              style={{ color: '#E4002B', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Forgot password?
            </button>
          </>
        )}

        {/* ─── STEP 1: ENTER EMAIL ─── */}
        {resetStep === 'email' && (
          <form onSubmit={handleForgotEmail} className="space-y-4">
            <p className="text-sm" style={{ color: '#666' }}>
              Enter your email and we&apos;ll send you a reset code.
            </p>
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                Email
              </label>
              <input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ borderColor: '#E5E5E5' }}
              />
            </div>
            {resetError && <p className="text-sm text-red-600">{resetError}</p>}
            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-2 rounded-lg text-white font-medium text-sm disabled:opacity-50"
              style={{ backgroundColor: '#E4002B' }}
            >
              {resetLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
            <button
              type="button"
              onClick={exitReset}
              className="w-full text-sm font-medium"
              style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Back to login
            </button>
          </form>
        )}

        {/* ─── STEP 2: ENTER CODE + NEW PASSWORD ─── */}
        {resetStep === 'code' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {resetSuccess && (
              <p className="text-sm rounded-lg px-3 py-2" style={{ backgroundColor: '#DEF7EC', color: '#03543F' }}>
                {resetSuccess}
              </p>
            )}
            <div>
              <label htmlFor="resetCode" className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                6-digit Code
              </label>
              <input
                id="resetCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest font-mono text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ borderColor: '#E5E5E5', letterSpacing: '0.3em' }}
                placeholder="000000"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1" style={{ color: '#333' }}>
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ borderColor: '#E5E5E5' }}
              />
            </div>
            {resetError && <p className="text-sm text-red-600">{resetError}</p>}
            <button
              type="submit"
              disabled={resetLoading || resetCode.length !== 6}
              className="w-full py-2 rounded-lg text-white font-medium text-sm disabled:opacity-50"
              style={{ backgroundColor: '#E4002B' }}
            >
              {resetLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={exitReset}
              className="w-full text-sm font-medium"
              style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Back to login
            </button>
          </form>
        )}

        {/* ─── STEP 3: DONE ─── */}
        {resetStep === 'done' && (
          <div className="space-y-4">
            <p className="text-sm rounded-lg px-3 py-2 text-center" style={{ backgroundColor: '#DEF7EC', color: '#03543F' }}>
              {resetSuccess}
            </p>
            <button
              onClick={exitReset}
              className="w-full py-2 rounded-lg text-white font-medium text-sm"
              style={{ backgroundColor: '#E4002B' }}
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
