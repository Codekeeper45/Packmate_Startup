import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, X, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/app/components/PageTransition';
import { motion, AnimatePresence } from 'motion/react';

type PackingItem = {
  name: string;
  quantity: number;
};

type PackingList = {
  [category: string]: PackingItem[];
};

export function EditList() {
  const navigate = useNavigate();
  const [packingList, setPackingList] = useState<PackingList>({});
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Clothing');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('packingList');
    if (stored) {
      setPackingList(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const updateQuantity = (category: string, index: number, delta: number) => {
    setPackingList((prev) => {
      const updated = { ...prev };
      const newQuantity = updated[category][index].quantity + delta;
      if (newQuantity > 0) {
        updated[category][index].quantity = newQuantity;
      }
      return updated;
    });
  };

  const removeItem = (category: string, index: number) => {
    setPackingList((prev) => {
      const updated = { ...prev };
      updated[category] = updated[category].filter((_, i) => i !== index);
      return updated;
    });
  };

  const addItem = () => {
    if (!newItemName.trim()) return;

    setPackingList((prev) => {
      const updated = { ...prev };
      if (!updated[selectedCategory]) {
        updated[selectedCategory] = [];
      }
      updated[selectedCategory].push({ name: newItemName, quantity: 1 });
      return updated;
    });

    setNewItemName('');
    setShowAddForm(false);
  };

  const handleContinue = () => {
    sessionStorage.setItem('packingList', JSON.stringify(packingList));
    navigate('/checklist');
  };

  const categories = Object.keys(packingList);
  const totalItems = Object.values(packingList).reduce(
    (sum, items) => sum + items.length,
    0
  );

  return (
    <PageTransition direction="forward">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 z-20">
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generate')}
              className="mb-4 flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border">
                <Sparkles className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h1 className="text-xl">Edit Packing List</h1>
                <p className="text-sm text-muted-foreground">{totalItems} items · AI Generated</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 pb-32">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Add Item Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="bg-card rounded-md p-6 border border-primary overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Add New Item</h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAddForm(false)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded-md transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
                        placeholder="Item name"
                        className="flex-1 px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addItem}
                        disabled={!newItemName.trim()}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        Add
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items by Category */}
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + categoryIndex * 0.1 }}
                className="bg-card rounded-md border border-border overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-muted px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">{category}</h2>
                    <span className="text-sm text-muted-foreground bg-background border border-border px-3 py-1 rounded-full">
                      {packingList[category].length} items
                    </span>
                  </div>
                </div>

                {/* Category Items */}
                <div className="divide-y divide-border">
                  <AnimatePresence mode="popLayout">
                    {packingList[category].map((item, index) => (
                      <motion.div
                        key={`${category}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-accent transition-colors group"
                      >
                        {/* Item Name */}
                        <div className="flex-1 min-w-0">
                          <span className="text-foreground">{item.name}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1 border border-border">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(category, index, -1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-background rounded transition-colors"
                          >
                            <span className="text-muted-foreground">−</span>
                          </motion.button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="w-8 text-center text-sm font-medium"
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(category, index, 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-background rounded transition-colors"
                          >
                            <span className="text-muted-foreground">+</span>
                          </motion.button>
                        </div>

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(category, index)}
                          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground rounded-md transition-all flex-shrink-0"
                          aria-label="Delete item"
                        >
                          <X className="w-5 h-5" strokeWidth={2.5} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add to Category Button */}
                <motion.button
                  whileHover={{ backgroundColor: 'var(--color-accent)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowAddForm(true);
                  }}
                  className="w-full px-6 py-3 text-foreground hover:bg-accent transition-colors border-t border-border flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add to {category}</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <AnimatePresence>
          {!showAddForm && (
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAddForm(true)}
              className="fixed bottom-24 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full border border-border flex items-center justify-center z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border z-20">
          <div className="max-w-2xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <span>Save & Continue</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
