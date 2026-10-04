'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface BrushstrokeXProps {
  className?: string;
  size?: number;
  color?: string; // Default Chalk or Ink
}

export function BrushstrokeX({
  className = '',
  size = 120,
  color = '#F3F1EC',
}: BrushstrokeXProps) {
  const shouldReduceMotion = useReducedMotion();

  // Smooth drawing transitions
  const strokeTransition1 = {
    duration: shouldReduceMotion ? 0 : 1.1,
    ease: [0.16, 1, 0.3, 1],
    delay: shouldReduceMotion ? 0 : 0.2,
  };

  const strokeTransition2 = {
    duration: shouldReduceMotion ? 0 : 1.1,
    ease: [0.16, 1, 0.3, 1],
    delay: shouldReduceMotion ? 0 : 0.55,
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="Level X architectural mark"
      >
        {/* Stroke 1: Top-Left to Bottom-Right sweeping gesture */}
        <motion.path
          d="M 18 18 Q 38 42, 82 82 M 22 18 Q 45 48, 78 82"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={strokeTransition1}
        />

        {/* Stroke 2: Top-Right to Bottom-Left crossing gesture */}
        <motion.path
          d="M 82 18 Q 55 45, 18 82 M 78 18 Q 52 50, 22 82"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={strokeTransition2}
        />

        {/* Micro architectural accent points */}
        <motion.circle
          cx="50"
          cy="50"
          r="1.5"
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 1.2, duration: 0.4 }}
        />
      </svg>
    </div>
  );
}
