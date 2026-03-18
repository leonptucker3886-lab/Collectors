'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 pb-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">CollectVault</h1>
          <p className="text-[#666] mt-2">Buy, sell & trade collectibles</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#333]">
          {showForgotPassword ? (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Reset Password</h2>
              <p className="text-[#666] text-sm mb-4">Enter your email and we'll send you a reset link.</p>
              
              {resetSent ? (
                <div className="bg-[#4ECDC4]/10 border border-[#4ECDC4] text-[#4ECDC4] px-4 py-3 rounded-lg mb-4">
                  Check your email for the reset link!
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-[#FF4757]/10 border border-[#FF4757] text-[#FF4757] px-4 py-2 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-1.5">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-[#242424] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#A855F7]"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A855F7]/25 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                </>
              )}
              
              <p className="text-center mt-4 text-[#A0A0A0]">
                Remember your password?{' '}
                <button onClick={() => { setShowForgotPassword(false); setResetSent(false); setError(''); }} className="text-[#A855F7] hover:underline">
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-6">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>

              {error && (
                <div className="bg-[#FF4757]/10 border border-[#FF4757] text-[#FF4757] px-4 py-2 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm text-[#A0A0A0] mb-1.5">Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full pl-10 pr-4 py-3 bg-[#242424] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#A855F7]"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-[#A0A0A0] mb-1.5">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#242424] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#A855F7]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#A0A0A0] mb-1.5">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#242424] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#A855F7]"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#A855F7] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A855F7]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                  {!loading && <FiArrowRight />}
                </button>
              </form>

              <p className="text-center mt-6 text-[#A0A0A0]">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                  className="text-[#A855F7] hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-6 text-[#666] text-sm">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
