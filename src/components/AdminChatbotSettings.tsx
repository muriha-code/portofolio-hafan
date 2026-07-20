import React, { useState, useEffect } from 'react';
import { Bot, Save, Loader2, Plus, Trash2, ShieldAlert, X } from 'lucide-react';
import { dbService } from '../services/db';
import { ChatbotSettings } from '../types';
import { toast } from 'react-hot-toast';

export const AdminChatbotSettings = () => {
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await dbService.getChatbotSettings();
      setSettings(data);
    } catch (error) {
      toast.error("Gagal memuat pengaturan chatbot.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await dbService.updateChatbotSettings(settings);
      toast.success("Pengaturan Chatbot berhasil disimpan.");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => prev ? { ...prev, [name]: checked } : null);
    } else if (type === 'number') {
      setSettings(prev => prev ? { ...prev, [name]: parseFloat(value) } : null);
    } else {
      setSettings(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleAddFaq = () => {
    setSettings(prev => prev ? { 
      ...prev, 
      faq: [...prev.faq, { question: '', answer: '' }] 
    } : null);
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setSettings(prev => {
      if (!prev) return null;
      const newFaq = [...prev.faq];
      newFaq[index][field] = value;
      return { ...prev, faq: newFaq };
    });
  };

  const handleRemoveFaq = (index: number) => {
    setSettings(prev => {
      if (!prev) return null;
      const newFaq = prev.faq.filter((_, i) => i !== index);
      return { ...prev, faq: newFaq };
    });
  };

  const handleAddBlockedTopic = () => {
    setSettings(prev => prev ? {
      ...prev,
      blockedTopics: [...prev.blockedTopics, '']
    } : null);
  };

  const handleBlockedTopicChange = (index: number, value: string) => {
    setSettings(prev => {
      if (!prev) return null;
      const newTopics = [...prev.blockedTopics];
      newTopics[index] = value;
      return { ...prev, blockedTopics: newTopics };
    });
  };

  const handleRemoveBlockedTopic = (index: number) => {
    setSettings(prev => {
      if (!prev) return null;
      const newTopics = prev.blockedTopics.filter((_, i) => i !== index);
      return { ...prev, blockedTopics: newTopics };
    });
  };

  if (loading || !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Bot size={24} className="text-primary" />
            Pengaturan AI Chatbot (Aster)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Konfigurasi perilaku, identitas, dan batasan asisten AI.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Pengaturan Dasar & Tampilan */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Dasar & Tampilan</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="relative">
                  <input type="checkbox" name="enabled" checked={settings.enabled} onChange={handleChange} className="sr-only" />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  <div className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${settings.enabled ? 'transform translate-x-4 bg-white' : 'bg-white'}`}></div>
                </div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Aktifkan AI Chatbot
                </div>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nama AI</label>
                <input
                  type="text"
                  name="aiName"
                  value={settings.aiName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Status AI</label>
                <select
                  name="status"
                  value={settings.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="online">Online (Hijau)</option>
                  <option value="busy">Away / Busy (Kuning)</option>
                  <option value="offline">Offline (Abu-abu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Placeholder Input</label>
                <input
                  type="text"
                  name="placeholderText"
                  value={settings.placeholderText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Pesan Sambutan (Markdown)</label>
                <textarea
                  name="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
             <h3 className="font-semibold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                Parameter Model
             </h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nama Model Gemini</label>
                  <input
                    type="text"
                    name="model"
                    value={settings.model}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Default: gemini-2.5-flash</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Max Tokens</label>
                    <input
                      type="number"
                      name="maxTokens"
                      value={settings.maxTokens}
                      onChange={handleChange}
                      min="100"
                      max="2048"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Temperature</label>
                    <input
                      type="number"
                      name="temperature"
                      value={settings.temperature}
                      onChange={handleChange}
                      min="0"
                      max="1"
                      step="0.1"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Kolom Kanan: Prompt, FAQ, Blocked Topics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              Instruksi Sistem (System Prompt)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Instruksi inti yang memberikan kepribadian, batasan, dan cara merespons AI. Konteks data portofolio akan ditambahkan otomatis di bawah instruksi ini.
            </p>
            <textarea
              name="systemPrompt"
              value={settings.systemPrompt}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-semibold text-slate-800 dark:text-white">Pertanyaan Sering Diajukan (FAQ)</h3>
              <button 
                onClick={handleAddFaq}
                className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded cursor-pointer"
              >
                <Plus size={14} /> Tambah FAQ
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Tambahkan pertanyaan dan jawaban khusus yang Anda ingin AI berikan secara spesifik (hardcoded knowledge).
            </p>
            
            <div className="space-y-4">
              {settings.faq.map((item, index) => (
                <div key={index} className="flex gap-3 items-start bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Pertanyaan..."
                      value={item.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-sm focus:outline-none focus:border-primary"
                    />
                    <textarea
                      placeholder="Jawaban..."
                      value={item.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-sm focus:outline-none focus:border-primary custom-scrollbar"
                    />
                  </div>
                  <button 
                    onClick={() => handleRemoveFaq(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded mt-1 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {settings.faq.length === 0 && (
                <div className="text-center py-4 text-sm text-slate-500">Belum ada FAQ.</div>
              )}
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-red-200 dark:border-red-900/30 pb-2">
              <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert size={18} /> Topik Terlarang (Blocked Topics)
              </h3>
              <button 
                onClick={handleAddBlockedTopic}
                className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded cursor-pointer"
              >
                <Plus size={14} /> Tambah Topik
              </button>
            </div>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-4">
              AI akan secara otomatis menolak permintaan yang mengandung atau menanyakan hal-hal berikut.
            </p>
            
            <div className="space-y-2">
              {settings.blockedTopics.map((topic, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleBlockedTopicChange(index, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded text-sm focus:outline-none focus:border-red-400"
                  />
                  <button 
                    onClick={() => handleRemoveBlockedTopic(index)}
                    className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
