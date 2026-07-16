import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { GraphicDesign } from '../types';

interface GraphicDesignGalleryProps {
  designs: GraphicDesign[];
}

export const GraphicDesignGallery: React.FC<GraphicDesignGalleryProps> = ({ designs }) => {
  const [selectedImage, setSelectedImage] = useState<GraphicDesign | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Extract unique categories dynamically
  const categories = ['All', ...Array.from(new Set(designs.map(d => d.category)))];

  const filteredDesigns = activeCategory === 'All'
    ? designs
    : designs.filter(d => d.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section 
      id="graphic-design" 
      className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Aset Kreatif</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Graphic Design Portfolio
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-3" />
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12 max-w-xl mx-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredDesigns.map((design) => (
              <motion.div
                layout
                key={design.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="break-inside-avoid relative rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedImage(design)}
              >
                {/* Image */}
                <img 
                  src={design.imageUrl} 
                  alt={design.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800";
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Cover info */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-accent">
                        {design.category}
                      </span>
                      <h4 className="text-base font-display font-bold text-white">
                        {design.title}
                      </h4>
                    </div>
                    <div className="p-2 rounded-full bg-white/10 text-white backdrop-blur-sm">
                      <Maximize2 size={12} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-16 text-slate-400 italic text-sm">
            Belum ada desain ditambahkan untuk kategori ini.
          </div>
        )}
      </div>

      {/* Lightbox / Preview Modal Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row"
            >
              {/* Image Frame */}
              <div className="flex-grow max-h-[60vh] md:max-h-[80vh] bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800";
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Sidebar Info */}
              <div className="p-6 md:p-8 md:w-80 shrink-0 flex flex-col justify-between text-left border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                      {selectedImage.category}
                    </span>
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                    {selectedImage.title}
                  </h3>

                  {selectedImage.description && (
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {selectedImage.description}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 mt-6 text-[11px] text-slate-400 font-medium">
                  <ImageIcon size={12} />
                  <span>Interactive Art Showcase</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
