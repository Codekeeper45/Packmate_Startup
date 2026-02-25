import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, BookmarkPlus, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTransition } from '@/app/components/PageTransition';

export function SuccessScreen() {
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const details = sessionStorage.getItem('tripDetails');
    if (details) {
      setTripDetails(JSON.parse(details));
    }
  }, []);

  const handleSaveTemplate = () => {
    // In a real app, this would save to a database
    const templates = JSON.parse(localStorage.getItem('templates') || '[]');
    const packingList = sessionStorage.getItem('packingList');
    const tripType = sessionStorage.getItem('tripType');
    
    templates.push({
      id: Date.now(),
      tripType,
      tripDetails,
      packingList: JSON.parse(packingList || '{}'),
      createdAt: new Date().toISOString(),
    });
    
    localStorage.setItem('templates', JSON.stringify(templates));
    setSaved(true);
  };

  const handleStartNew = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <PageTransition direction="fade">
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center border border-border"
          >
            <CheckCircle2 className="w-14 h-14 text-foreground" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h1 className="text-4xl font-medium">100% Packed!</h1>
            <p className="text-lg text-muted-foreground">
              You're all set for your adventure
            </p>
          </motion.div>

          {/* Trip Summary */}
          {tripDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-md border border-border p-6 text-left space-y-3"
            >
              <h3 className="text-sm text-muted-foreground">Trip Summary</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Destination:</span>{' '}
                  <span className="text-foreground">{tripDetails.location}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Dates:</span>{' '}
                  <span className="text-foreground">
                    {new Date(tripDetails.startDate).toLocaleDateString()} -{' '}
                    {new Date(tripDetails.endDate).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Accommodation:</span>{' '}
                  <span className="capitalize text-foreground">{tripDetails.accommodation}</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <motion.button
              whileHover={{ scale: saved ? 1 : 1.02 }}
              whileTap={{ scale: saved ? 1 : 0.98 }}
              onClick={handleSaveTemplate}
              disabled={saved}
              className={`w-full flex items-center justify-center gap-2 py-4 px-8 rounded-md transition-all border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                saved
                  ? 'bg-muted text-muted-foreground border-border'
                  : 'bg-card text-foreground hover:bg-accent border-border'
              }`}
            >
              <BookmarkPlus className="w-5 h-5" />
              {saved ? 'Template Saved!' : 'Save as Template'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartNew}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Home className="w-5 h-5" />
              Start New Trip
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-muted-foreground"
          >
            Have a wonderful journey! ✈️
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
}