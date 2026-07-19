import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, User, FolderHeart, Shield, Briefcase, Award, 
  Palette, MessageSquare, Settings as SettingsIcon, LogOut, Sparkles,
  Plus, Edit2, Trash2, Check, Mail, Lock, PlusCircle, CheckCircle2,
  Trash, Eye, Loader2, Upload, FileText, Star, Compass, Terminal, ShieldAlert
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { dbService } from '../services/db';
import { Profile, Project, Skill, Experience, Certificate, Message, Settings } from '../types';
import { LucideIcon } from './LucideIcon';
import { ImageCropperModal } from './ImageCropperModal';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'projects' | 'skills' | 'experience' | 'certificates' | 'messages' | 'settings'>('dashboard');
  
  // States for database entities
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states (Add/Edit modals)
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Image Cropper State
  const [pendingCrop, setPendingCrop] = useState<{
    imageSrc: string;
    file: File;
    targetInputId: string;
    aspectRatio?: number;
    helperText?: string;
  } | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, targetInputId: string, aspectRatio?: number, helperText?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear input so user can reselect the same file if they cancel
    e.target.value = '';

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPendingCrop({
        imageSrc: reader.result as string,
        file,
        targetInputId,
        aspectRatio,
        helperText
      });
    });
    reader.readAsDataURL(file);
  };

  // Fetch all CMS records
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [p, s, projs, sks, exps, certs, msgs] = await Promise.all([
        dbService.getProfile(),
        dbService.getSettings(),
        dbService.getProjects(),
        dbService.getSkills(),
        dbService.getExperiences(),
        dbService.getCertificates(),
        dbService.getMessages()
      ]);
      setProfile(p);
      setSettings(s);
      setProjects(projs);
      setSkills(sks);
      setExperiences(exps);
      setCertificates(certs);
      setMessages(msgs);
    } catch (error) {
      console.error("Gagal memuat data CMS:", error);
      toast.error("Terjadi masalah saat memuat data dari database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handler Profile Save
  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updatedProfile: Profile = {
        name: formData.get('name') as string,
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        description: formData.get('description') as string,
        avatarUrl: formData.get('avatarUrl') as string,
        bio: formData.get('bio') as string,
        education: formData.get('education') as string,
        passion: formData.get('passion') as string,
        careerObjective: formData.get('careerObjective') as string,
        resumeUrl: formData.get('resumeUrl') as string,
      };
      await dbService.updateProfile(updatedProfile);
      setProfile(updatedProfile);
      toast.success("Biodata profil berhasil diperbarui!");
    } catch (e) {
      toast.error("Gagal menyimpan profil.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler Settings Save
  const handleSettingsSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updatedSettings: Settings = {
        websiteTitle: formData.get('websiteTitle') as string,
        logoText: formData.get('logoText') as string,
        resumeLink: formData.get('resumeLink') as string,
        linkedinUrl: formData.get('linkedinUrl') as string,
        githubUrl: formData.get('githubUrl') as string,
        instagramUrl: formData.get('instagramUrl') as string,
        emailAddress: formData.get('emailAddress') as string,
        whatsappNumber: formData.get('whatsappNumber') as string,
        metaDescription: formData.get('metaDescription') as string,
        heroText: formData.get('heroText') as string,
      };
      await dbService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success("Pengaturan website berhasil disimpan!");
    } catch (e) {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setSubmitting(false);
    }
  };

  // Universal CRUD helper
  const openAddModal = () => {
    setEditingItem({ _isNew: true });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem({ ...item, _isNew: false });
    setIsModalOpen(true);
  };

  const handleCRUDSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      if (activeTab === 'projects') {
        const payload = {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          longDescription: formData.get('longDescription') as string,
          thumbnailUrl: formData.get('thumbnailUrl') as string,
          techStack: (formData.get('techStack') as string).split(',').map(s => s.trim()).filter(Boolean),
          githubUrl: formData.get('githubUrl') as string,
          liveUrl: formData.get('liveUrl') as string,
          category: formData.get('category') as string,
          year: formData.get('year') as string,
          featured: formData.get('featured') === 'true',
          screenshots: (formData.get('screenshots') as string).split(',').map(s => s.trim()).filter(Boolean)
        };

        if (editingItem._isNew) {
          await dbService.createProject(payload);
          toast.success("Project baru berhasil ditambahkan!");
        } else {
          await dbService.updateProject(editingItem.id, payload);
          toast.success("Project berhasil diperbarui!");
        }
      } else if (activeTab === 'skills') {
        const payload = {
          name: formData.get('name') as string,
          category: formData.get('category') as string,
          iconName: formData.get('iconName') as string,
        };

        if (editingItem._isNew) {
          await dbService.createSkill(payload);
          toast.success("Keahlian baru berhasil ditambahkan!");
        } else {
          await dbService.updateSkill(editingItem.id, payload);
          toast.success("Keahlian berhasil diperbarui!");
        }
      } else if (activeTab === 'experience') {
        const payload = {
          role: formData.get('role') as string,
          company: formData.get('company') as string,
          period: formData.get('period') as string,
          description: formData.get('description') as string,
          type: formData.get('type') as string,
        };

        if (editingItem._isNew) {
          await dbService.createExperience(payload);
          toast.success("Pengalaman baru berhasil ditambahkan!");
        } else {
          await dbService.updateExperience(editingItem.id, payload);
          toast.success("Pengalaman berhasil diperbarui!");
        }
      } else if (activeTab === 'certificates') {
        const payload = {
          title: formData.get('title') as string,
          issuer: formData.get('issuer') as string,
          year: formData.get('year') as string,
          thumbnailUrl: formData.get('thumbnailUrl') as string,
          pdfUrl: formData.get('pdfUrl') as string,
        };

        if (editingItem._isNew) {
          await dbService.createCertificate(payload);
          toast.success("Sertifikat baru berhasil ditambahkan!");
        } else {
          await dbService.updateCertificate(editingItem.id, payload);
          toast.success("Sertifikat berhasil diperbarui!");
        }

      }

      setIsModalOpen(false);
      setEditingItem(null);
      fetchAllData(); // Refresh data
    } catch (err) {
      toast.error("Gagal menyimpan perubahan database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCRUDDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      if (activeTab === 'projects') await dbService.deleteProject(id);
      else if (activeTab === 'skills') await dbService.deleteSkill(id);
      else if (activeTab === 'experience') await dbService.deleteExperience(id);
      else if (activeTab === 'certificates') await dbService.deleteCertificate(id);

      
      toast.success("Data berhasil dihapus!");
      fetchAllData();
    } catch (err) {
      toast.error("Gagal menghapus data.");
    }
  };

  // Drag-and-drop / File Upload handling inside form fields
  const handleFileUpload = async (file: File, targetInputId: string) => {
    toast.loading("Mengunggah file...", { id: 'upload-toast' });
    try {
      const path = `uploads/${activeTab}/${Date.now()}_${file.name}`;
      const downloadUrl = await dbService.uploadFile(file, path);
      
      // Update form field value
      const inputEl = document.getElementById(targetInputId) as HTMLInputElement;
      if (inputEl) {
        inputEl.value = downloadUrl;
        // Trigger synthetic change if necessary
        const event = new Event('change', { bubbles: true });
        inputEl.dispatchEvent(event);
      }
      
      toast.success("Unggah file selesai!", { id: 'upload-toast' });
    } catch (err) {
      toast.error("Gagal mengunggah file.", { id: 'upload-toast' });
    }
  };

  // Message Actions
  const handleMarkMessageRead = async (id: string, read: boolean) => {
    try {
      await dbService.markMessageAsRead(id, read);
      toast.success(read ? "Pesan ditandai telah dibaca." : "Pesan ditandai belum dibaca.");
      fetchAllData();
    } catch (err) {
      toast.error("Gagal memproses pesan.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Hapus pesan ini secara permanen?")) return;
    try {
      await dbService.deleteMessage(id);
      toast.success("Pesan berhasil dihapus.");
      fetchAllData();
    } catch (err) {
      toast.error("Gagal menghapus pesan.");
    }
  };

  // Sidebar Menu Items
  interface MenuItem {
    id: 'dashboard' | 'profile' | 'projects' | 'skills' | 'experience' | 'certificates' | 'messages' | 'settings';
    label: string;
    icon: any;
    badge?: number;
  }

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderHeart },
    { id: 'skills', label: 'Skills', icon: Shield },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award },

    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messages.filter(m => !m.read).length },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-primary mb-4" size={32} />
        <p className="text-sm font-medium tracking-wide text-slate-400">Menyiapkan CMS Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-800 dark:text-slate-200">
      <Toaster position="bottom-right" />
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex flex-col justify-between">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 font-display font-bold text-lg text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Sparkles className="text-primary animate-pulse" size={20} />
            <span>CMS Admin Panel</span>
          </div>

          {/* Menus */}
          <nav className="space-y-1.5 text-left">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500 text-white leading-none">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-primary border border-slate-200 dark:border-slate-700">
              MR
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Admin</h4>
              <p className="text-[10px] text-slate-400">Logged in offline/online</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full mt-4 flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Keluar CMS</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen text-left">
        {/* Header toolbar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white capitalize">
              {activeTab}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kelola dan sinkronisasi data {activeTab} portofolio Anda ke Firestore
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${dbService.isCloudMode() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              Database: {dbService.isCloudMode() ? 'Firebase Live' : 'LocalStorage'}
            </span>
          </div>
        </header>

        {/* TAB 1: DASHBOARD STATS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Projects</h4>
                  <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-2">{projects.length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <FolderHeart size={20} />
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skills</h4>
                  <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-2">{skills.length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Shield size={20} />
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certificates</h4>
                  <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-2">{certificates.length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Award size={20} />
                </div>
              </div>



              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unread Messages</h4>
                  <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-2">
                    {messages.filter(m => !m.read).length}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
                  <MessageSquare size={20} />
                </div>
              </div>
            </div>

            {/* Quick guide on connecting real Firebase */}
            {!dbService.isCloudMode() && (
              <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <ShieldAlert size={16} /> Mode Fallback Lokal Aktif
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Sistem saat ini menyimpan data secara lokal di browser Anda. Hubungkan ke real Cloud Firestore & Auth Anda dengan mengisi variabel di file <code className="font-mono bg-slate-200/60 dark:bg-slate-800 px-1 rounded">.env</code> dan me-restart dev server.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 transition-colors"
                >
                  Lihat Panduan Koneksi
                </button>
              </div>
            )}

            {/* Recent Messages table list */}
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Pesan Kontak Masuk Terbaru
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Nama</th>
                      <th className="py-3 px-4">Subjek</th>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.slice(0, 5).map((msg) => (
                      <tr key={msg.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-950/40">
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-200">{msg.name}</td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{msg.subject}</td>
                        <td className="py-4 px-4 text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${msg.read ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-600'}`}>
                            {msg.read ? 'Read' : 'New'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleMarkMessageRead(msg.id, !msg.read)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-pointer"
                            title="Mark read/unread"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 rounded bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-colors cursor-pointer"
                            title="Hapus pesan"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 italic">Belum ada pesan masuk dari form kontak.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE CRUD */}
        {activeTab === 'profile' && profile && (
          <form onSubmit={handleProfileSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-6 sm:p-8 space-y-6 max-w-4xl animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                <input required type="text" name="name" defaultValue={profile.name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendidikan (e.g. S1 Sains Informasi - Unpad)</label>
                <input required type="text" name="education" defaultValue={profile.education} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title Utama (e.g. Information Science Student)</label>
                <input required type="text" name="title" defaultValue={profile.title} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtitle Peran (e.g. Web Developer & Designer)</label>
                <input required type="text" name="subtitle" defaultValue={profile.subtitle} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Foto Profil URL (Dapat berupa link web atau file drop di bawah)</label>
                <div className="flex gap-4">
                  <input id="profile_avatar_url" required type="text" name="avatarUrl" defaultValue={profile.avatarUrl} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                  
                  {/* File Upload Trigger */}
                  <label className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center shrink-0">
                    <Upload size={16} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageSelect(e, 'profile_avatar_url', 1, 'Rekomendasi ukuran gambar: 400 × 400 px (rasio 1:1)')}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Rekomendasi ukuran gambar: 400 × 400 px (rasio 1:1)</p>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Singkat (Tampil di Hero Section)</label>
                <textarea rows={3} required name="description" defaultValue={profile.description} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary resize-none" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biodata Lengkap (Tampil di About Section)</label>
                <textarea rows={4} required name="bio" defaultValue={profile.bio} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary resize-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passion (Tampil di About)</label>
                <input required type="text" name="passion" defaultValue={profile.passion} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Career Objective / Target Karir</label>
                <input required type="text" name="careerObjective" defaultValue={profile.careerObjective} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume PDF Link atau Upload File</label>
                <div className="flex gap-4">
                  <input id="profile_resume_url" required type="text" name="resumeUrl" defaultValue={profile.resumeUrl} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                  <label className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center shrink-0">
                    <Upload size={16} />
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'profile_resume_url');
                      }} 
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-end">
              <button 
                type="submit" 
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-lg hover:bg-primary/95 transition-all cursor-pointer flex items-center gap-2"
              >
                {submitting && <Loader2 className="animate-spin" size={14} />}
                Simpan Perubahan Profile
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: PROJECTS LIST & MODAL */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Toolbar row */}
            <div className="flex justify-end">
              <button 
                onClick={openAddModal}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <PlusCircle size={16} /> Tambah Project Baru
              </button>
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex gap-4 text-left">
                  <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                    <img 
                      src={proj.thumbnailUrl} 
                      alt={proj.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200"; }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-bold uppercase text-slate-400">{proj.category}</span>
                        {proj.featured && <span className="px-2 py-0.5 rounded-full text-[8px] bg-primary/15 text-primary font-bold">Featured</span>}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{proj.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{proj.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-2.5 mt-2">
                      <span className="text-[10px] text-slate-400 font-semibold">Tahun {proj.year}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEditModal(proj)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"><Edit2 size={12} /></button>
                        <button onClick={() => handleCRUDDelete(proj.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 cursor-pointer"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="col-span-2 py-16 text-center text-slate-400 italic text-sm">Belum ada project portofolio. Klik tombol tambah untuk membuat baru!</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SKILLS LIST & MODAL */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-end">
              <button onClick={openAddModal} className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow">
                <PlusCircle size={16} /> Tambah Keahlian Baru
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-primary">
                      <LucideIcon name={skill.iconName || 'Code'} size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{skill.category}</h4>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{skill.name}</h3>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(skill)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"><Edit2 size={12} /></button>
                    <button onClick={() => handleCRUDDelete(skill.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 cursor-pointer"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
              {skills.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 italic text-sm">Belum ada data keahlian. Klik tombol tambah untuk menambahkan!</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-end">
              <button onClick={openAddModal} className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow">
                <PlusCircle size={16} /> Tambah Pengalaman Baru
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex items-start justify-between text-left">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px] font-bold uppercase">{exp.type}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{exp.period}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                    <h4 className="text-xs text-slate-500 font-bold">{exp.company}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mt-1">{exp.description}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0 ml-4">
                    <button onClick={() => openEditModal(exp)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"><Edit2 size={12} /></button>
                    <button onClick={() => handleCRUDDelete(exp.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 cursor-pointer"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
              {experiences.length === 0 && (
                <div className="py-16 text-center text-slate-400 italic text-sm">Belum ada riwayat pengalaman. Klik tombol tambah untuk menambahkan!</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-end">
              <button onClick={openAddModal} className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow">
                <PlusCircle size={16} /> Tambah Sertifikat Baru
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-100 dark:border-slate-800">
                      <img src={cert.thumbnailUrl} alt={cert.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=200"; }} referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase text-primary tracking-widest">{cert.issuer}</span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-2 leading-snug">{cert.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3 mt-4">
                    <span className="text-[10px] text-slate-400 font-semibold">Tahun {cert.year}</span>
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(cert)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"><Edit2 size={12} /></button>
                      <button onClick={() => handleCRUDDelete(cert.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 cursor-pointer"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 italic text-sm">Belum ada data sertifikat kredensial. Klik tombol tambah untuk menambahkan!</div>
              )}
            </div>
          </div>
        )}



        {/* TAB 8: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-6 sm:p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Nama</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Subjek</th>
                      <th className="py-3 px-4">Pesan</th>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-950/40">
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-200">{msg.name}</td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{msg.email}</td>
                        <td className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-400 max-w-xs truncate">{msg.subject}</td>
                        <td className="py-4 px-4 text-slate-500 max-w-xs truncate">{msg.message}</td>
                        <td className="py-4 px-4 text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${msg.read ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-600'}`}>
                            {msg.read ? 'Read' : 'New'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2 shrink-0">
                          <button
                            onClick={() => handleMarkMessageRead(msg.id, !msg.read)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-pointer"
                            title="Tandai Baca / Belum Baca"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 rounded bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 italic">Belum ada pesan kontak masuk.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS GENERAL */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6 max-w-4xl animate-fadeIn">
            <form onSubmit={handleSettingsSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website Browser Title</label>
                  <input required type="text" name="websiteTitle" defaultValue={settings.websiteTitle} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logo Brand Text (e.g. Rifky.Hafan)</label>
                  <input required type="text" name="logoText" defaultValue={settings.logoText} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subheading Slogan Hero (Tampil di Meta / Subjudul)</label>
                  <input required type="text" name="heroText" defaultValue={settings.heroText} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Deskripsi SEO Website</label>
                  <textarea rows={2} required name="metaDescription" defaultValue={settings.metaDescription} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
                  <input required type="url" name="linkedinUrl" defaultValue={settings.linkedinUrl} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub URL</label>
                  <input required type="url" name="githubUrl" defaultValue={settings.githubUrl} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instagram URL</label>
                  <input required type="url" name="instagramUrl" defaultValue={settings.instagramUrl} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Utama</label>
                  <input required type="email" name="emailAddress" defaultValue={settings.emailAddress} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Number (dengan kode negara, e.g. +6281...)</label>
                  <input required type="text" name="whatsappNumber" defaultValue={settings.whatsappNumber} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume PDF Link</label>
                  <input required type="text" name="resumeLink" defaultValue={settings.resumeLink} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-end">
                <button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-lg hover:bg-primary/95 transition-all cursor-pointer flex items-center gap-2">
                  {submitting && <Loader2 className="animate-spin" size={14} />}
                  Simpan Pengaturan Utama
                </button>
              </div>
            </form>

            {/* Detailed guide inside settings on setup variables */}
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Panduan Menghubungkan Firebase Live (Production)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Portofolio ini mendukung integrasi database relasional / Firestore & Auth secara live. Untuk mengaktifkannya di server container atau hosting lokal:
              </p>
              <ol className="list-decimal pl-5 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <li>Buka console Firebase Anda dan buat project baru.</li>
                <li>Aktifkan <strong>Email/Password Sign-In</strong> di Firebase Authentication.</li>
                <li>Aktifkan <strong>Cloud Firestore</strong> database dan tambahkan koleksi sesuai petunjuk.</li>
                <li>Aktifkan <strong>Firebase Storage</strong> bucket untuk penyimpanan file.</li>
                <li>Salin konfigurasi Firebase Web App SDK dan tambahkan ke berkas <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code> Anda:</li>
              </ol>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 text-[10px] font-mono overflow-x-auto select-all">
{`VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="12345678"
VITE_FIREBASE_APP_ID="1:1234:web:abcd"`}
              </pre>
            </div>
          </div>
        )}

        {/* UNIVERSAL CRUD FORM DIALOG MODAL */}
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

            {/* Modal Body */}
            <div className="relative max-w-2xl w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col text-left max-h-[90vh]">
              <form onSubmit={handleCRUDSubmit} className="flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingItem._isNew ? 'Tambah Data Baru' : 'Edit Data Eksisting'}
                  </h3>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                    Close
                  </button>
                </div>

                {/* Dynamic inputs based on activeTab */}
                <div className="p-6 overflow-y-auto space-y-4">
                  
                  {/* Active Tab: PROJECTS INPUTS */}
                  {activeTab === 'projects' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Project</label>
                          <input required type="text" name="title" defaultValue={editingItem.title || ''} placeholder="Aether - Deployment Platform" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Kategori</label>
                          <select name="category" defaultValue={editingItem.category || 'Web Development'} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary">
                            <option value="Web Development">Web Development</option>
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="Software Engineering">Software Engineering</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Deskripsi Singkat</label>
                        <input required type="text" name="description" defaultValue={editingItem.description || ''} placeholder="Platform deployment cloud super cepat..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Penjelasan Panjang Detail</label>
                        <textarea rows={3} name="longDescription" defaultValue={editingItem.longDescription || ''} placeholder="Aether dirancang untuk mempercepat setup hosting statis dan database..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary resize-none" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun Pembuatan</label>
                          <input required type="text" name="year" defaultValue={editingItem.year || '2026'} placeholder="2026" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Featured Project?</label>
                          <select name="featured" defaultValue={editingItem.featured ? 'true' : 'false'} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary">
                            <option value="false">Tidak</option>
                            <option value="true">Ya, tampilkan badge Featured</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Tech Stack (pisahkan dengan koma)</label>
                        <input required type="text" name="techStack" defaultValue={editingItem.techStack ? editingItem.techStack.join(', ') : ''} placeholder="React, TypeScript, Tailwind CSS, Firebase" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">GitHub Repo URL</label>
                          <input type="url" name="githubUrl" defaultValue={editingItem.githubUrl || ''} placeholder="https://github.com/..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Live Website URL</label>
                          <input type="url" name="liveUrl" defaultValue={editingItem.liveUrl || ''} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Thumbnail Cover URL (atau upload file)</label>
                        <div className="flex gap-4">
                          <input id="proj_thumb_url" required type="text" name="thumbnailUrl" defaultValue={editingItem.thumbnailUrl || ''} placeholder="https://unsplash.com/..." className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                          <label className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center shrink-0">
                            <Upload size={16} />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleImageSelect(e, 'proj_thumb_url', 16/9, 'Rekomendasi ukuran gambar: 1200 × 675 px (rasio 16:9)')}
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Rekomendasi ukuran gambar: 1200 × 675 px (rasio 16:9)</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Screenshots URLs (pisahkan dengan koma)</label>
                        <input type="text" name="screenshots" defaultValue={editingItem.screenshots ? editingItem.screenshots.join(', ') : ''} placeholder="https://image1.com, https://image2.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                  )}

                  {/* Active Tab: SKILLS INPUTS */}
                  {activeTab === 'skills' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Keahlian</label>
                          <input required type="text" name="name" defaultValue={editingItem.name || ''} placeholder="React" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Kategori Group</label>
                          <select name="category" defaultValue={editingItem.category || 'Frontend'} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary">
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="UI/UX & Design">UI/UX & Design</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Icon Name (Lucide string name)</label>
                          <select name="iconName" defaultValue={editingItem.iconName || 'Code'} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary">
                            <option value="Code">Code (HTML/CSS)</option>
                            <option value="Palette">Palette (Desain/CSS)</option>
                            <option value="Zap">Zap (JavaScript/Speed)</option>
                            <option value="ShieldCheck">ShieldCheck (TypeScript/Auth)</option>
                            <option value="Cpu">Cpu (React/Sistem)</option>
                            <option value="Terminal">Terminal (Next/Server)</option>
                            <option value="Wind">Wind (Tailwind)</option>
                            <option value="Layers">Layers (Backend/Arsitektur)</option>
                            <option value="Server">Server (Express/Node)</option>
                            <option value="Flame">Flame (Firebase)</option>
                            <option value="Database">Database (Firestore)</option>
                            <option value="FolderGit2">FolderGit2 (Storage/Git)</option>
                            <option value="Figma">Figma</option>
                            <option value="Image">Image (Photoshop)</option>
                            <option value="PenTool">PenTool (Illustrator)</option>
                            <option value="Compass">Compass (Canva/Navigasi)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Tab: EXPERIENCE INPUTS */}
                  {activeTab === 'experience' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Peran / Jabatan</label>
                          <input required type="text" name="role" defaultValue={editingItem.role || ''} placeholder="Frontend Developer" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Tipe</label>
                          <select name="type" defaultValue={editingItem.type || 'Work'} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary">
                            <option value="Work">Pekerjaan Utama (Work)</option>
                            <option value="Freelance">Pekerjaan Lepas (Freelance)</option>
                            <option value="Education">Pendidikan (Education)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Perusahaan / Institusi</label>
                          <input required type="text" name="company" defaultValue={editingItem.company || ''} placeholder="PT Teknologi Startup" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Periode</label>
                          <input required type="text" name="period" defaultValue={editingItem.period || ''} placeholder="Jan 2026 - Present" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Penjelasan / Tanggung Jawab</label>
                        <textarea rows={4} required name="description" defaultValue={editingItem.description || ''} placeholder="Membangun antarmuka dashboard admin premium..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary resize-none" />
                      </div>
                    </div>
                  )}

                  {/* Active Tab: CERTIFICATES INPUTS */}
                  {activeTab === 'certificates' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Sertifikat Kredensial</label>
                        <input required type="text" name="title" defaultValue={editingItem.title || ''} placeholder="Certified Web Developer" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Penerbit (Issuer)</label>
                          <input required type="text" name="issuer" defaultValue={editingItem.issuer || ''} placeholder="Google / Dicoding" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun Perolehan</label>
                          <input required type="text" name="year" defaultValue={editingItem.year || '2025'} placeholder="2025" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Gambar Pratinjau Cover (atau upload file)</label>
                        <div className="flex gap-4">
                          <input id="cert_thumb_url" required type="text" name="thumbnailUrl" defaultValue={editingItem.thumbnailUrl || ''} placeholder="https://images.unsplash.com/photo-..." className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                          <label className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center shrink-0">
                            <Upload size={16} />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleImageSelect(e, 'cert_thumb_url', 4/3, 'Rekomendasi ukuran gambar: 800 × 600 px (rasio 4:3)')}
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Rekomendasi ukuran gambar: 800 × 600 px (rasio 4:3)</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">File PDF Kredensial URL (atau upload file)</label>
                        <div className="flex gap-4">
                          <input id="cert_pdf_url" required type="text" name="pdfUrl" defaultValue={editingItem.pdfUrl || '#'} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary" />
                          <label className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center shrink-0">
                            <Upload size={16} />
                            <input 
                              type="file" 
                              accept=".pdf,application/pdf" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'cert_pdf_url');
                              }} 
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    )}

                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5 shrink-0 bg-slate-50 dark:bg-slate-900/40">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer">
                    Batal
                  </button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer">
                    {submitting && <Loader2 className="animate-spin" size={12} />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Image Cropper Modal Layer */}
      {pendingCrop && (
        <ImageCropperModal
          imageSrc={pendingCrop.imageSrc}
          fileName={pendingCrop.file.name}
          aspectRatio={pendingCrop.aspectRatio}
          helperText={pendingCrop.helperText}
          onCancel={() => setPendingCrop(null)}
          onCropCompleteAction={(croppedFile) => {
            setPendingCrop(null);
            handleFileUpload(croppedFile, pendingCrop.targetInputId);
          }}
        />
      )}
    </div>
  );
};
