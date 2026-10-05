'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, ArrowRight, Key, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const ADMIN_PASSKEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'levelx3d-admin-2026';
const ADMIN_EMAILS = [
  'admin@levelx3d.com',
  'nikhilmali007@gmail.com',
  'nikhil@levelx3d.com',
  'executive@levelx3d.com',
];

const ADMIN_AUTH_STORAGE_KEY = 'levelx3d_admin_unlocked';

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, signIn, isLoading } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'passkey' | 'email'>('passkey');

  // Check if current user is an admin or if passkey session is active
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (stored === 'true') {
        setIsUnlocked(true);
        return;
      }
    }

    if (user?.email) {
      const isEmailAdmin =
        ADMIN_EMAILS.includes(user.email.toLowerCase()) ||
        user.email.toLowerCase().endsWith('@levelx3d.com') ||
        (user.user_metadata as any)?.role === 'admin';

      if (isEmailAdmin) {
        setIsUnlocked(true);
      }
    }
  }, [user]);

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (passkeyInput.trim() === ADMIN_PASSKEY) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
      }
      setIsUnlocked(true);
    } else {
      setErrorMsg('Invalid Executive Passkey. Access denied.');
    }
  };

  const handleAdminEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await signIn(adminEmail.trim().toLowerCase(), adminPassword);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        const isEmailAdmin =
          ADMIN_EMAILS.includes(adminEmail.toLowerCase()) ||
          adminEmail.toLowerCase().endsWith('@levelx3d.com');

        if (isEmailAdmin) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
          }
          setIsUnlocked(true);
        } else {
          setErrorMsg('This account does not have executive admin privileges.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
      </div>
    );
  }

  // If unlocked, render the protected children
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Otherwise, render the Protected Admin Gate
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#ECE9E2]/50 border border-hairline-light rounded-3xl p-8 sm:p-10 shadow-sm backdrop-blur-sm space-y-6 text-center"
      >
        <div className="w-14 h-14 rounded-2xl border border-hairline-light mx-auto flex items-center justify-center text-ink bg-canvas shadow-xs">
          <Lock className="w-6 h-6 stroke-[1.4]" />
        </div>

        <div className="space-y-1.5">
          <span className="font-heading text-xs tracking-apple-widest uppercase text-slate font-light block">
            Level X 3D &bull; Executive Studio Console
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
            Restricted Admin Area
          </h1>
          <p className="text-xs text-slate leading-relaxed">
            This console is reserved exclusively for the Level X 3D studio administrator.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-canvas border border-hairline-light rounded-xl text-xs font-heading font-light tracking-wide uppercase">
          <button
            type="button"
            onClick={() => {
              setActiveTab('passkey');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'passkey'
                ? 'bg-onyx text-chalk shadow-xs'
                : 'text-slate hover:text-ink'
            }`}
          >
            Studio Passkey
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'email'
                ? 'bg-onyx text-chalk shadow-xs'
                : 'text-slate hover:text-ink'
            }`}
          >
            Admin Sign In
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'passkey' ? (
          <form onSubmit={handlePasskeySubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                Master Studio Passkey
              </label>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-slate absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter studio passkey"
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-ink outline-none"
                />
              </div>
              <span className="text-[10px] font-mono text-slate block pt-0.5">
                Default: <code className="bg-canvas px-1 py-0.5 rounded text-ink">levelx3d-admin-2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-onyx hover:bg-ink text-chalk text-xs font-heading font-light tracking-apple-wide uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminEmailSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                Admin Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@levelx3d.com"
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-ink outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-ink outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-onyx hover:bg-ink text-chalk text-xs font-heading font-light tracking-apple-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Admin...</span>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-hairline-light text-center">
          <Link
            href="/"
            className="text-xs font-sans text-slate hover:text-ink transition-colors inline-flex items-center gap-1"
          >
            &larr; Return to Storefront
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
