import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, Sparkles } from 'lucide-react';
import { PageTransition } from '@/app/components/PageTransition';
import { motion, AnimatePresence } from 'motion/react';

const generatePackingList = (tripType: string, accommodation: string, activityLevel: string) => {
  const baseItems = {
    Clothing: [
      { name: 'T-shirts', quantity: 3 },
      { name: 'Underwear', quantity: 4 },
      { name: 'Socks', quantity: 4 },
      { name: 'Pants', quantity: 2 },
    ],
    Gear: [],
    Tech: [
      { name: 'Phone charger', quantity: 1 },
      { name: 'Power bank', quantity: 1 },
    ],
    Meds: [
      { name: 'First aid kit', quantity: 1 },
      { name: 'Pain relievers', quantity: 1 },
    ],
  };

  // Customize based on trip type
  if (tripType === 'hiking') {
    baseItems.Clothing.push({ name: 'Hiking boots', quantity: 1 }, { name: 'Rain jacket', quantity: 1 });
    baseItems.Gear.push(
      { name: 'Backpack', quantity: 1 },
      { name: 'Water bottle', quantity: 2 },
      { name: 'Headlamp', quantity: 1 },
      { name: 'Trail map', quantity: 1 }
    );
  } else if (tripType === 'beach') {
    baseItems.Clothing.push({ name: 'Swimsuit', quantity: 2 }, { name: 'Sunglasses', quantity: 1 });
    baseItems.Gear.push(
      { name: 'Beach towel', quantity: 1 },
      { name: 'Sunscreen SPF 50', quantity: 1 },
      { name: 'Beach bag', quantity: 1 }
    );
  } else if (tripType === 'business') {
    baseItems.Clothing.push({ name: 'Dress shirt', quantity: 3 }, { name: 'Suit', quantity: 1 });
    baseItems.Tech.push({ name: 'Laptop', quantity: 1 }, { name: 'Laptop charger', quantity: 1 });
  }

  // Add tent-specific items
  if (accommodation === 'tent') {
    baseItems.Gear.push({ name: 'Sleeping bag', quantity: 1 }, { name: 'Tent', quantity: 1 });
  }

  return baseItems;
};

export function AIGeneration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusMessages, setStatusMessages] = useState<string[]>([]);

  useEffect(() => {
    // Simulate AI generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Add status messages progressively
    const statusTimings = [
      { delay: 900, message: 'Analyzing destination climate...' },
      { delay: 1800, message: 'Customizing for activity level...' },
      { delay: 2700, message: 'Finalizing essentials...' },
    ];

    const timeouts = statusTimings.map(({ delay, message }) =>
      setTimeout(() => setStatusMessages((prev) => [...prev, message]), delay)
    );

    // Generate list after 3 seconds
    const timeout = setTimeout(() => {
      const tripType = sessionStorage.getItem('tripType') || 'hiking';
      const tripDetails = JSON.parse(sessionStorage.getItem('tripDetails') || '{}');
      
      const packingList = generatePackingList(
        tripType,
        tripDetails.accommodation || 'hotel',
        tripDetails.activityLevel || 'moderate'
      );

      sessionStorage.setItem('packingList', JSON.stringify(packingList));
      setLoading(false);
      
      setTimeout(() => {
        navigate('/edit');
      }, 800);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      timeouts.forEach(clearTimeout);
    };
  }, [navigate]);

  return (
    <PageTransition direction="fade">
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center border border-border"
            >
              {loading ? (
                <Loader2 className="w-10 h-10 text-foreground animate-spin" />
              ) : (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Sparkles className="w-10 h-10 text-foreground" />
                </motion.div>
              )}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl"
            >
              {loading ? 'Generating your list...' : 'All set!'}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              {loading
                ? 'AI is analyzing your trip details'
                : 'Your personalized packing list is ready'}
            </motion.p>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full bg-primary"
            />
          </motion.div>

          {/* Progressive status messages */}
          <div className="text-sm text-muted-foreground space-y-2 min-h-[72px]">
            <AnimatePresence mode="popLayout">
              {statusMessages.map((message, index) => (
                <motion.p
                  key={message}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ✓ {message}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}