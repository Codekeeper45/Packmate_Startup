import { useNavigate } from 'react-router';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PageTransition } from '@/app/components/PageTransition';
import { motion } from 'motion/react';

export function Onboarding() {
  const navigate = useNavigate();

  return (
    <PageTransition direction="fade">
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl tracking-tight">PackMate</h1>
            <p className="text-lg text-muted-foreground">
              AI-powered packing lists for every adventure
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-64 h-64 mx-auto bg-muted flex items-center justify-center"
          >
            <div className="text-muted-foreground">Image Placeholder</div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/trip-type')}
            className="w-full bg-primary text-primary-foreground py-4 px-8 border border-primary transition-all duration-200 hover:bg-primary/90 active:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Start Packing
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            Never forget essentials again
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
}