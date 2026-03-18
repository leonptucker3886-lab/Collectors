'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#C0A080] flex items-center justify-center text-3xl font-light text-black">
              CV
            </div>
            <h1 className="text-2xl font-light tracking-wide text-white">CollectVault</h1>
            <p className="text-[#666] mt-2 text-sm">Premium Collectors Network</p>
          </div>

          <div className="bg-[#141414] rounded-xl p-6 border border-[#1F1F1F]">
            {showForgotPassword ? (
              <>
                <h2 className="text-lg font-light text-white mb-2">Reset Password</h2>
                <p className="text-sm text-[#666] mb-4">Enter your email for a reset link.</p>
                
                {resetSent ? (
                  <div className="bg-[#C0A080]/10 border border-[#C0A080]/30 text-[#C0A080] px-4 py-3 rounded-lg text-sm">
                    Check your email for the reset link.
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] focus:border-[#C0A080] outline-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#C0A080] text-black rounded-lg font-medium disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </form>
                  </>
                )}
                
                <button
                  onClick={() => { setShowForgotPassword(false); setResetSent(false); setError(''); }}
                  className="w-full mt-4 text-sm text-[#666]"
                >
                  ← Back to sign in
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-light text-white mb-6">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>

                {error && (
                  <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] focus:border-[#C0A080] outline-none"
                        required={isSignUp}
                      />
                    </div>
                  )}

                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] focus:border-[#C0A080] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] focus:border-[#C0A080] outline-none"
                      required
                      minLength={6}
                    />
                  </div>

                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-[#666] hover:text-[#C0A080]"
                    >
                      Forgot password?
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#C0A080] text-black rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    {!loading && <FiArrowRight size={18} />}
                  </button>
                </form>

                <p className="text-center mt-6 text-sm text-[#666]">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                    className="text-[#C0A080]"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </>
            )}
          </div>

          <p className="text-center mt-6 text-xs text-[#444]">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
