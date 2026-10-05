'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const { user, signIn, signUp, signInWithGoogle, isLoading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already authenticated, redirect
  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectPath);
    }
  }, [user, isLoading, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && (!fullName.trim() || fullName.trim().length < 2)) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(cleanEmail, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage('Signed in successfully. Redirecting...');
          setTimeout(() => router.push(redirectPath), 400);
        }
      } else {
        const res = await signUp(cleanEmail, password, {
          name: fullName.trim(),
          phone: phone.trim(),
        });
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage('Account created successfully. Welcome to Level X 3D.');
          setTimeout(() => router.push(redirectPath), 600);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);
    try {
      const res = await signInWithGoogle();
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setTimeout(() => router.push(redirectPath), 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not authenticate with Google.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 sm:py-20 font-sans">
      <div className="rounded-3xl border border-hairline-light bg-[#ECE9E2]/30 p-6 sm:p-10 shadow-sm space-y-8 backdrop-blur-sm">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <span className="font-heading text-[11px] tracking-apple-widest uppercase text-slate font-light block">
            Level X 3D &bull; Collector Portal
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">
            {mode === 'signin'
              ? 'Access your bespoke commission ledger, saved delivery details, and order tracking.'
              : 'Join Level X 3D to access archival studio releases and streamlined checkout.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-canvas border border-hairline-light rounded-xl text-xs font-heading font-light tracking-wide uppercase">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-onyx text-chalk shadow-xs'
                : 'text-slate hover:text-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-onyx text-chalk shadow-xs'
                : 'text-slate hover:text-ink'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full py-3.5 px-4 bg-canvas hover:bg-white text-ink border border-hairline-light hover:border-ink/30 rounded-xl text-xs font-sans font-medium flex items-center justify-center gap-3 transition-all shadow-2xs disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-hairline-light" />
            </div>
            <span className="relative bg-[#ECE9E2] sm:bg-[#ECE9E2]/80 px-3 text-[10px] font-mono uppercase text-slate tracking-wider rounded">
              or continue with email
            </span>
          </div>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 text-xs text-red-600 flex items-center gap-2.5 font-sans"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2.5 font-sans"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up Extra Fields */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Full Name <span className="text-ink">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Nikhil Mali"
                    className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Mobile Phone <span className="text-slate text-[10px]">(Optional)</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate tracking-wider block">
              Email Address <span className="text-ink">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nikhil@example.com"
                className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                Password <span className="text-ink">*</span>
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('For password recovery in production, check your email link or use Google Sign In.')}
                  className="text-[11px] font-sans text-slate hover:text-ink transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate hover:text-ink transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-onyx hover:bg-ink text-chalk text-xs sm:text-sm font-heading font-light tracking-apple-wide uppercase text-center shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-chalk/30 border-t-chalk rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[1.4]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Guest Checkout Notice if arriving from checkout */}
        {redirectPath.includes('checkout') && (
          <div className="pt-4 border-t border-hairline-light text-center space-y-1">
            <span className="text-xs text-slate font-sans block">
              Prefer to order without an account?
            </span>
            <Link
              href="/checkout"
              className="text-xs font-mono text-ink font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Continue with Guest Checkout</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
