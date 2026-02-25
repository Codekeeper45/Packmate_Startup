import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Check, ArrowLeft, Edit } from 'lucide-react';
import { PageTransition } from '@/app/components/PageTransition';
import { motion, AnimatePresence } from 'motion/react';

type PackingItem = {
  name: string;
  quantity: number;
  packed?: boolean;
};

type PackingList = {
  [category: string]: PackingItem[];
};

export function PackingChecklist() {
  const navigate = useNavigate();
  const [packingList, setPackingList] = useState<PackingList>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('packingList');
    if (stored) {
      const list = JSON.parse(stored);
      // Initialize packed status
      const initialized: PackingList = {};
      Object.keys(list).forEach((category) => {
        initialized[category] = list[category].map((item: PackingItem) => ({
          ...item,
          packed: false,
        }));
      });
      setPackingList(initialized);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Calculate progress
    let total = 0;
    let packed = 0;
    
    Object.values(packingList).forEach((items) => {
      items.forEach((item) => {
        total++;
        if (item.packed) packed++;
      });
    });

    const newProgress = total > 0 ? Math.round((packed / total) * 100) : 0;
    setProgress(newProgress);

    // Navigate to success when 100%
    if (newProgress === 100 && total > 0) {
      setTimeout(() => {
        navigate('/success');
      }, 500);
    }
  }, [packingList, navigate]);

  const toggleItem = (category: string, index: number) => {
    setPackingList((prev) => {
      const updated = { ...prev };
      updated[category][index].packed = !updated[category][index].packed;
      return updated;
    });
  };

  const categories = Object.keys(packingList);

  return (
    <PageTransition direction="forward">
      <div className="min-h-screen bg-background px-6 py-6 pb-32">
        <div className="max-w-2xl mx-auto">
          {/* Back/Edit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/edit')}
              className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/edit')}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm">Edit List</span>
            </motion.button>
          </motion.div>

          {/* Sticky Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-0 bg-background border border-border rounded-md p-6 mb-6 z-10"
          >
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-medium">Packing Progress</h1>
              <motion.span
                key={progress}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl text-foreground font-medium"
              >
                {progress}%
              </motion.span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="h-full bg-primary"
              />
            </div>
          </motion.div>

          {/* Checklist Items */}
          <div className="space-y-6">
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.1 }}
                className="bg-card rounded-md border border-border p-6"
              >
                <h2 className="text-lg font-medium mb-4">{category}</h2>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {packingList[category].map((item, index) => (
                      <motion.label
                        key={`${category}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: categoryIndex * 0.05 + index * 0.03 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        className={`flex items-center gap-4 p-4 rounded-md border cursor-pointer transition-all ${
                          item.packed
                            ? 'bg-muted border-border'
                            : 'bg-card border-border hover:bg-accent'
                        }`}
                      >
                        <motion.div
                          animate={{
                            scale: item.packed ? [1, 1.2, 1] : 1,
                            backgroundColor: item.packed ? 'var(--color-primary)' : 'transparent',
                          }}
                          transition={{ duration: 0.3 }}
                          className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
                            item.packed
                              ? 'border-primary bg-primary'
                              : 'border-input'
                          }`}
                        >
                          <AnimatePresence>
                            {item.packed && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              >
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        
                        <input
                          type="checkbox"
                          checked={item.packed || false}
                          onChange={() => toggleItem(category, index)}
                          className="sr-only"
                        />
                        
                        <motion.span
                          animate={{
                            textDecoration: item.packed ? 'line-through' : 'none',
                            opacity: item.packed ? 0.6 : 1,
                          }}
                          className={`flex-1 transition-all ${
                            item.packed ? 'text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {item.name}
                        </motion.span>
                        
                        <span
                          className={`px-3 py-1 rounded-full text-sm border transition-all ${
                            item.packed
                              ? 'bg-muted text-muted-foreground border-border'
                              : 'bg-accent text-foreground border-border'
                          }`}
                        >
                          × {item.quantity}
                        </span>
                      </motion.label>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
