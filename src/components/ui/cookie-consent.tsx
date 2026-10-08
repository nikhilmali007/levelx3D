'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('levelx3d_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('levelx3d_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm"
        >
          <div className="bg-onyx text-chalk p-5 rounded-2xl shadow-2xl flex flex-col gap-4 border border-white/10">
            <p className="text-sm font-sans leading-relaxed">
              We use cookies to improve your experience and analyze site traffic.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 py-2 bg-chalk text-onyx text-xs font-heading tracking-wide uppercase rounded-xl hover:bg-white transition-colors"
              >
                Accept
              </button>
              <a
                href="#"
                className="flex-1 py-2 text-center text-xs font-heading tracking-wide uppercase text-chalk hover:text-white transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
