import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast, Toaster } from 'react-hot-toast';
import { Mail, Phone, Send, Linkedin, Github, Instagram, ArrowRight, Loader2 } from 'lucide-react';
import { dbService } from '../services/db';
import { Settings } from '../types';
  
interface ContactFormProps {
  settings: Settings;
}

// Zod schema for form validation
const contactSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal terdiri dari 2 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  subject: z.string().min(4, { message: "Subjek minimal terdiri dari 4 karakter" }),
  message: z.string().min(10, { message: "Pesan minimal terdiri dari 10 karakter" }),
});

type ContactInput = z.infer<typeof contactSchema>;

export const ContactForm: React.FC<ContactFormProps> = ({ settings }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      await dbService.createMessage(data);
      toast.success("Pesan Anda berhasil dikirim! Saya akan segera menghubungi Anda.");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/40 px-6 overflow-hidden"
    >
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Hubungi Saya</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Get In Touch
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Contact Cards & Social */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Mari Berdiskusi Mengenai Projek Anda
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Apakah Anda memiliki tawaran magang, pekerjaan lepas (freelance), kolaborasi projek, atau sekadar ingin menyapa? Silakan kirimkan pesan Anda melalui form di samping, atau hubungi saya langsung via platform di bawah ini.
              </p>
            </div>

            {/* Visual Quick Contact Boxes */}
            <div className="space-y-4">
              {/* Box 1: Email */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</h4>
                  <a 
                    href="mailto:designmuriha@gmail.com"
                    className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition-colors"
                  >
                    designmuriha@gmail.com
                  </a>
                </div>
              </div>

              {/* Box 2: WhatsApp */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp</h4>
                  <a 
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition-colors"
                  >
                    {settings.whatsappNumber}
                  </a>
                </div>
              </div>

            </div>

            {/* Social Media Row Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Platforms</h4>
              <div className="flex items-center gap-3">
                {settings.linkedinUrl && (
                  <a 
                    href={settings.linkedinUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] dark:hover:bg-[#0A66C2] dark:hover:border-[#0A66C2] transition-all cursor-pointer shadow-sm"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin size={16} />
                  </a>
                )}

                  <a 
                    href="https://github.com/muriha-code" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-slate-950 hover:border-slate-950 dark:hover:bg-white dark:hover:text-slate-950 dark:hover:border-white transition-all cursor-pointer shadow-sm"
                    aria-label="GitHub Profile"
                  >
                    <Github size={16} />
                  </a>

                  <a 
                    href="https://instagram.com/muriha04" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-600 hover:border-transparent transition-all cursor-pointer shadow-sm"
                    aria-label="Instagram Profile"
                  >
                    <Instagram size={16} />
                  </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/10 shadow-xl space-y-5 text-left h-full flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama Anda"
                    {...register('name')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-red-500 font-medium">{errors.name.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[11px] text-red-500 font-medium">{errors.email.message}</span>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Subjek Pesan
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Mengenai apa pesan ini?"
                    {...register('subject')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.subject 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary'
                    }`}
                  />
                  {errors.subject && (
                    <span className="text-[11px] text-red-500 font-medium">{errors.subject.message}</span>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Pesan Detail
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tulis detail keperluan atau pesan Anda di sini..."
                    {...register('message')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary'
                    }`}
                  />
                  {errors.message && (
                    <span className="text-[11px] text-red-500 font-medium">{errors.message.message}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-3.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Mengirim Pesan...
                  </>
                ) : (
                  <>
                    Kirim Pesan
                    <Send size={12} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
