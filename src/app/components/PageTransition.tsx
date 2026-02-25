import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

type PageTransitionProps = {
  children: ReactNode;
  direction?: 'forward' | 'back' | 'fade';
};

export function PageTransition({ children, direction = 'forward' }: PageTransitionProps) {
  const variants = {
    forward: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-20%', opacity: 0 },
    },
    back: {
      initial: { x: '-100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '20%', opacity: 0 },
    },
    fade: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
    },
  };

  const selectedVariant = variants[direction];

  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
