'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiMail, FiArrowRight, FiShield, FiStar, FiUsers, FiPackage } from 'react-icons/fi';
import Logo from '../../components/ui/Logo';

const FEATURES = [
  { icon: '📦', title: 'Track Items', desc: 'Organize your collection' },
  { icon: '💰', title: 'Track Value', desc: 'Monitor worth over time' },
  { icon: '📸', title: 'Photo Gallery', desc: 'Showcase your items' },
];

const TESTIMONIALS = [
  { name: 'Alex M.', text: 'Found my holy grail card here!', rating: 5 },
  { name: 'Sarah K.', text: 'Best marketplace for collectors.', rating: 5 },
  { name: 'Mike T.', text: 'Sold my entire collection fast.', rating: 5 },
];

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
      router.push('/landmark');
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
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-6 lg:p-12 lg:pr-6 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <div className="flex items-center gap-3 mb-8">
              <Logo size="md" />
              <div>
                <h1 className="text-2xl font-light tracking-wide text-white">CollectVault</h1>
                <p className="text-xs text-[#666]">Collection Inventory App</p>
              </div>
            </div>

            <div className="bg-[#C0A080]/10 border border-[#C0A080]/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-[#C0A080] font-medium mb-1">⚠️ Database Being Built</p>
              <p className="text-xs text-[#666]">
                Login system is currently under construction. Please login as guest to continue.
              </p>
              <button
                onClick={() => router.push('/collections')}
                className="mt-3 px-4 py-2 bg-[#C0A080] text-black rounded-lg text-sm font-medium w-full"
              >
                Continue as Guest
              </button>
            </div>

            <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">
              {isSignUp ? 'Join the Community' : 'Welcome Back'}
            </h2>
            <p className="text-[#888] mb-8">
              {isSignUp 
                ? 'Start tracking your collections today.'
                : 'Continue managing your collection.'
              }
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {FEATURES.map((feature, i) => (
                <div key={i} className="bg-[#141414] rounded-xl p-3 border border-[#1F1F1F] text-center">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <p className="text-xs text-white font-medium">{feature.title}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={14} className="text-[#C0A080] fill-current" />
                  ))}
                </div>
                <span className="text-sm text-white">4.9/5 from 2,000+ reviews</span>
              </div>
              <div className="space-y-2">
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="text-sm text-[#666]">
                    <span className="text-white">"{t.text}"</span>
                    <span className="text-[#444] ml-2">— {t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-[#444]">
              <span className="flex items-center gap-1"><FiShield size={14} /> Secure</span>
              <span className="flex items-center gap-1"><FiUsers size={14} /> 50K+ Users</span>
              <span className="flex items-center gap-1"><FiPackage size={14} /> 100K+ Items</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#0A0A0A] p-6 lg:p-12 lg:pl-6 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="bg-[#141414] rounded-2xl p-6 border border-[#1F1F1F]">
              {showForgotPassword ? (
                <>
                  <h2 className="text-xl font-light text-white mb-2">Reset Password</h2>
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
                    className="w-full mt-4 text-sm text-[#666] hover:text-white"
                  >
                    ← Back to sign in
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-light text-white mb-6">
                    {isSignUp ? 'Create Account' : 'Sign In'}
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
    </div>
  );
}
