import { useNavigate } from 'react-router';
import { Mountain, Waves, Building2, Briefcase, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PageTransition } from '@/app/components/PageTransition';
import { motion } from 'motion/react';
import { useKeyboardShortcuts } from '@/app/hooks/useKeyboardShortcuts';

const tripTypes = [
  {
    id: 'hiking',
    name: 'Hiking',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1756306501647-e952422b75b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHBlYWt8ZW58MXx8fHwxNzY5NTcwODg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Mountains',
  },
  {
    id: 'beach',
    name: 'Beach',
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1631535152690-ba1a85229136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwb2NlYW58ZW58MXx8fHwxNzY5NTEwMTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Sea',
  },
  {
    id: 'city',
    name: 'City',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1750810908078-a4729905bf4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHVyYmFufGVufDF8fHx8MTc2OTUwMDUzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Urban',
  },
  {
    id: 'business',
    name: 'Business',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1589979034086-5885b60c8f59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG9mZmljZXxlbnwxfHx8fDE3Njk0Nzk0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional',
  },
];

export function TripTypeSelection() {
  const navigate = useNavigate();
  useKeyboardShortcuts();

  const handleSelect = (type: string) => {
    sessionStorage.setItem('tripType', type);
    navigate('/details');
  };

  return (
    <PageTransition direction="forward">
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl mb-2">What type of trip?</h1>
            <p className="text-muted-foreground">Choose your adventure style</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tripTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(type.id)}
                  className="group w-full border border-border bg-card hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <div className="h-48 bg-muted flex items-center justify-center border-b border-border group-hover:bg-muted/80 transition-colors">
                    <Icon className="w-16 h-16 text-muted-foreground group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6 text-left">
                    <h3 className="text-2xl font-medium mb-1">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}