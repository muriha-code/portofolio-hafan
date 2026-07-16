import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Download, FileText, X, Award } from 'lucide-react';
import { Certificate } from '../types';

interface CertificatesProps {
  certificates: Certificate[];
}

export const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <section 
      id="certificates" 
      className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Kredensial</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Certificates & Licenses
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-3" />
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ y: -6 }}
              className="group flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300"
            >
              {/* Thumbnail Cover */}
              <div 
                className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                onClick={() => setSelectedCert(cert)}
              >
                <img 
                  src={cert.thumbnailUrl} 
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800";
                  }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual hover layer */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/95 text-slate-950 rounded-full text-xs font-bold shadow flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ExternalLink size={12} />
                    Preview Sertifikat
                  </span>
                </div>
              </div>

              {/* Text Info Box */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary dark:text-accent tracking-widest uppercase">
                      {cert.issuer}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Tahun {cert.year}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {cert.title}
                  </h3>
                </div>

                {/* Bottom Row Buttons */}
                <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-6">
                  <button 
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 py-2 text-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/40 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText size={12} /> Preview
                  </button>

                  <a 
                    href={cert.pdfUrl && cert.pdfUrl !== '#' ? cert.pdfUrl : undefined}
                    onClick={cert.pdfUrl && cert.pdfUrl !== '#' ? undefined : (e) => { e.preventDefault(); alert("Silahkan hubungi Rifky atau download via link sertifikat online!"); }}
                    download={cert.pdfUrl && cert.pdfUrl !== '#' ? `${cert.title}.pdf` : undefined}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/20 hover:bg-primary/5 hover:text-primary dark:hover:bg-accent/5 dark:hover:text-accent text-slate-500 transition-all cursor-pointer"
                    title="Download PDF"
                  >
                    <Download size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="text-center py-12 text-slate-400 italic text-sm">
            Belum ada sertifikat kredensial ditambahkan.
          </div>
        )}
      </div>

      {/* Lightbox / preview overlay */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col text-left"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest">
                      {selectedCert.issuer}
                    </span>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
                      {selectedCert.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedCert(null)}
                    className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[4/3] w-full max-h-[60vh] flex items-center justify-center">
                  <img 
                    src={selectedCert.thumbnailUrl} 
                    alt={selectedCert.title} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800";
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Award size={14} className="text-primary" /> Verified Credential (Tahun {selectedCert.year})
                  </span>
                  
                  {selectedCert.pdfUrl && selectedCert.pdfUrl !== '#' && (
                    <a 
                      href={selectedCert.pdfUrl}
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary transition-all flex items-center gap-1.5"
                    >
                      View Original File
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
