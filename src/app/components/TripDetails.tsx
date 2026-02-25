import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, MapPin, Home, Activity, ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/app/components/PageTransition';
import { motion } from 'motion/react';

export function TripDetails() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    sessionStorage.setItem('tripDetails', JSON.stringify({
      location,
      startDate,
      endDate,
      accommodation,
      activityLevel,
    }));
    
    navigate('/generate');
  };

  const isValid = location && startDate && endDate && accommodation;

  return (
    <PageTransition direction="forward">
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/trip-type')}
            className="mb-6 flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-3xl mb-2">Trip Details</h1>
            <p className="text-muted-foreground">Help us customize your packing list</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin className="w-4 h-4" />
                Destination
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Swiss Alps"
                className="w-full px-4 py-3 border border-border bg-input-background rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring hover:border-ring/50"
                required
              />
            </motion.div>

            {/* Dates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-input-background rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring hover:border-ring/50"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-input-background rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring hover:border-ring/50"
                  required
                />
              </div>
            </motion.div>

            {/* Accommodation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Home className="w-4 h-4" />
                Accommodation
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['tent', 'hotel'].map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => setAccommodation(type)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3 rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring ${
                      accommodation === type
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card hover:bg-accent hover:border-ring/50'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Activity Level */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Activity className="w-4 h-4" />
                Activity Level
              </label>
              <div className="space-y-2">
                {['light', 'moderate', 'intense'].map((level) => (
                  <motion.label
                    key={level}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md border cursor-pointer transition-all duration-200 ${
                      activityLevel === level
                        ? 'border-primary bg-muted'
                        : 'border-border bg-card hover:bg-accent hover:border-ring/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="activityLevel"
                      value={level}
                      checked={activityLevel === level}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="w-4 h-4 text-primary accent-primary"
                    />
                    <span className="capitalize">{level}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: isValid ? 1.02 : 1 }}
              whileTap={{ scale: isValid ? 0.98 : 1 }}
              type="submit"
              disabled={!isValid}
              className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground py-4 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Generate List
            </motion.button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}