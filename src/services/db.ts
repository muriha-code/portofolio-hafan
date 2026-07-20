import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Profile, Project, Skill, Experience, Certificate, Message, Settings, ChatbotSettings } from '../types';

// Detect if real Firebase config is available in env
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY' &&
  firebaseConfig.projectId
);

let app;
let analytics: any = null;
let auth: any = null;
let firestore: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    if (firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully in real cloud mode!");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to LocalStorage:", error);
  }
} else {
  console.log("Firebase is not fully configured. Running in high-fidelity LocalStorage fallback mode!");
}

// Default Seed Data
const defaultProfile: Profile = {
  name: "Muhamad Rifky Hafan",
  title: "Information Science Student",
  subtitle: "Web Developer & Graphic Designer",
  description: "Saya adalah mahasiswa Sains Informasi yang memiliki ketertarikan besar dalam pengembangan website modern dan UI/UX Design. Saya senang membangun website yang cepat, responsif, memiliki pengalaman pengguna yang baik, serta fungsional.",
  avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600", // Placeholder elegant avatar
  bio: "Halo! Saya Muhamad Rifky Hafan, seorang mahasiswa Sains Informasi dengan hasrat mendalam pada integrasi antara teknologi dan desain UI/UX. Fokus saya adalah menciptakan solusi digital yang fungsional tanpa mengorbankan estetika visual. Melalui keahlian dalam Frontend/Full-Stack Development, saya membantu brand dan startup menerjemahkan ide mereka menjadi produk digital yang premium.",
  education: "S1 Sains Informasi - Universitas Padjadjaran",
  passion: "Menciptakan desain web interaktif, tipografi presisi, dan arsitektur kode bersih yang ramah SEO.",
  careerObjective: "Menjadi seorang Frontend Engineer atau UI/UX Designer yang berkontribusi aktif dalam menciptakan produk digital berdampak tinggi di industri teknologi.",
  resumeUrl: "#"
};

const defaultSettings: Settings = {
  websiteTitle: "Muhamad Rifky Hafan | Portfolio",
  logoText: "Rifky.Hafan",
  resumeLink: "#",
  linkedinUrl: "https://linkedin.com/in/muhamad-rifky-hafan",
  githubUrl: "https://github.com/rifkyhafan",
  instagramUrl: "https://instagram.com/rifkyhafan",
  emailAddress: "muhrifkyh527190@gmail.com",
  whatsappNumber: "+6281234567890",
  metaDescription: "Website portfolio pribadi Muhamad Rifky Hafan - Web Developer",
  heroText: "Developing Premium Web Solutions"
};

const defaultChatbotSettings: ChatbotSettings = {
  enabled: true,
  aiName: "Aster",
  welcomeMessage: "Halo! Saya **Aster**, AI Assistant dari **Muriha Studio**. Saya siap membantu Anda mengenal lebih jauh tentang profil, proyek, pengalaman, keterampilan, sertifikasi, maupun layanan yang tersedia. Saya juga dapat menjawab berbagai pertanyaan umum seputar teknologi dan pengetahuan lainnya. Silakan tanyakan apa pun.",
  placeholderText: "Ask Aster anything...",
  status: "online",
  systemPrompt: `Kamu adalah Aster, AI Assistant resmi untuk Muriha Studio. Tugasmu membantu pengunjung menemukan informasi mengenai profil, proyek, pengalaman, keterampilan, sertifikasi, layanan, dan informasi lain yang tersedia pada website maupun CMS Muriha Studio. Gunakan data portfolio sebagai sumber utama jika pertanyaan berkaitan dengan Muriha Studio. Jika pertanyaan berada di luar konteks portfolio, jawab menggunakan pengetahuan umum dengan bahasa yang akurat dan mudah dipahami.

Jika pengguna bertanya mengenai namamu, jelaskan bahwa Aster berasal dari bahasa Yunani yang berarti "bintang". Nama tersebut dipilih oleh pemilik Muriha Studio karena melambangkan penunjuk arah. Seperti bintang yang membantu menunjukkan arah, kamu dirancang untuk memandu pengunjung menemukan informasi dengan cepat, jelas, dan mudah dipahami. Jika pengguna memuji nama tersebut, ucapkan terima kasih dengan rendah hati.

Berkomunikasilah dengan gaya yang ramah, profesional, komunikatif, dan informatif. Berikan jawaban singkat untuk pertanyaan sederhana, serta penjelasan yang lebih rinci jika diminta. Jika informasi mengenai Muriha Studio tidak tersedia, katakan dengan jujur bahwa informasi tersebut belum tersedia dan jangan pernah mengarang jawaban.

Jangan pernah mengaku sebagai manusia. Perkenalkan dirimu sebagai AI Assistant untuk Muriha Studio. Jangan mengaku sebagai ChatGPT, Gemini, atau AI lain kecuali pengguna secara khusus menanyakan teknologi yang digunakan. Jika ditanya, jelaskan bahwa kamu adalah Aster yang dibangun menggunakan teknologi AI modern untuk membantu pengunjung Muriha Studio.

Tolak dengan sopan permintaan yang berkaitan dengan pornografi, eksploitasi seksual, terorisme, malware, phishing, hacking ilegal, penipuan, pembuatan senjata, narkotika, ujaran kebencian, maupun aktivitas yang melanggar hukum atau membahayakan. Cukup sampaikan bahwa kamu tidak dapat membantu permintaan tersebut dan arahkan pengguna untuk mengajukan pertanyaan lain yang aman.`,
  model: "gemini-3.1-flash-lite",
  maxTokens: 800,
  temperature: 0.7,
  faq: [
    { question: "Siapa Muriha Studio?", answer: "Muriha Studio adalah entitas yang dijalankan oleh Muhamad Rifky Hafan, seorang Web Developer dan UI/UX Designer." },
    { question: "Apakah tersedia untuk freelance?", answer: "Ya, saat ini saya menerima proyek freelance untuk Web Development dan UI/UX Design." }
  ],
  blockedTopics: [
    "Pornografi atau konten seksual eksplisit",
    "Eksploitasi seksual",
    "Kekerasan ekstrem",
    "Terorisme",
    "Pembuatan bom atau senjata",
    "Malware, ransomware, phishing, pencurian akun, cracking, maupun aktivitas ilegal lainnya",
    "Penyalahgunaan data pribadi",
    "Ujaran kebencian",
    "Aktivitas kriminal",
    "Penipuan"
  ]
};

const defaultSkills: Skill[] = [
  // Frontend
  { id: 'f1', name: 'HTML5', category: 'Frontend', iconName: 'Code' },
  { id: 'f2', name: 'CSS3', category: 'Frontend', iconName: 'Palette' },
  { id: 'f3', name: 'JavaScript', category: 'Frontend', iconName: 'Zap' },
  { id: 'f4', name: 'Tailwind CSS', category: 'Frontend', iconName: 'Wind' },
  // Backend
  { id: 'b1', name: 'PHP', category: 'Backend', iconName: 'Layers' },
  { id: 'b2', name: 'Node.js', category: 'Backend', iconName: 'Server' },
  { id: 'b3', name: 'Firebase', category: 'Backend', iconName: 'Flame' },
  // Database
  { id: 'd1', name: 'MySQL', category: 'Database', iconName: 'Database' },
  { id: 'd2', name: 'Firestore', category: 'Database', iconName: 'Database' },
  { id: 'd3', name: 'Firebase Storage', category: 'Database', iconName: 'FolderGit2' },
  // UI/UX & Design
  { id: 'u1', name: 'Figma', category: 'UI/UX & Design', iconName: 'Figma' },
  { id: 'u2', name: 'Canva', category: 'UI/UX & Design', iconName: 'Compass' },
  { id: 'u3', name: 'Adobe Express', category: 'UI/UX & Design', iconName: 'PenTool' }
];

const defaultProjects: Project[] = [
  {
    id: 'p1',
    title: "Aether - Modern Developer Platform",
    description: "Platform deployment cloud dengan antarmuka real-time, grafik performa, dan manajemen serverless dengan arsitektur modern.",
    longDescription: "Aether adalah platform visual cloud yang membantu developer menyebarkan dan memantau aplikasi mereka. Dilengkapi dengan command menu (Cmd+K) interaktif, dashboard analitik, dan integrasi instan dengan hosting global.",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Framer Motion"],
    githubUrl: "https://github.com/rifkyhafan",
    liveUrl: "https://example.com",
    featured: true,
    category: "Web Development",
    year: "2026"
  },
  {
    id: 'p2',
    title: "Chronos - Keyboard-first Task Tracker",
    description: "Aplikasi manajemen tugas super cepat dengan shortcut keyboard, command menu (Cmd+K), dan visualisasi board minimalis.",
    longDescription: "Chronos didesain khusus bagi profesional yang menyukai navigasi keyboard. Dengan performa tinggi dan desain ultra-minimalis bergaya Linear, Chronos mengorganisir alur kerja tim secara efisien.",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005198143-d366bc00171a?auto=format&fit=crop&q=80&w=800",
    screenshots: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/rifkyhafan",
    liveUrl: "https://example.com",
    featured: true,
    category: "Web Development",
    year: "2025"
  },
  {
    id: 'p3',
    title: "Aura Studio - 3D Interactive Design System",
    description: "Sistem desain interaktif dengan penyesuaian warna dinamis, pencahayaan, dan material produk secara real-time.",
    longDescription: "Sebuah eksperimen antarmuka visual yang terinspirasi oleh Apple dan Framer. Memungkinkan pengguna mengonfigurasi komponen visual 3D dalam tampilan modern.",
    thumbnailUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800",
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
    ],
    techStack: ["Figma", "React", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com/rifkyhafan",
    liveUrl: "https://example.com",
    featured: false,
    category: "UI Design",
    year: "2025"
  },
  {
    id: 'p4',
    title: "Stasis - Interactive Portfolio Template",
    description: "Situs web portofolio agensi dengan tipografi yang berani, scroll-triggered animations, dan skema warna gelap monokrom.",
    longDescription: "Desain visual modern dengan grid presisi, tipografi Swiss (Inter), dan nuansa dark premium. Dirancang untuk memperkuat personal branding agensi kreatif.",
    thumbnailUrl: "https://images.unsplash.com/photo-1602578529399-5014766c278e?auto=format&fit=crop&q=80&w=800",
    screenshots: [],
    techStack: ["Adobe Photoshop", "Canva", "HTML", "CSS"],
    githubUrl: "https://github.com/rifkyhafan",
    liveUrl: "https://example.com",
    featured: false,
    category: "Graphic Design",
    year: "2026"
  }
];


const defaultExperiences: Experience[] = [
  {
    id: 'e1',
    role: "Full Stack Web Developer Intern",
    company: "Startup Tech Indo",
    period: "Jan 2026 - Present",
    description: "Membangun platform web menggunakan React/Next.js, TypeScript, dan Tailwind CSS. Mengoptimalkan performa web, SEO, dan mengintegrasikan Firestore untuk sinkronisasi data real-time.",
    type: "Work"
  },
  {
    id: 'e2',
    role: "Freelance UI/UX & Graphic Designer",
    company: "Upwork & Fiverr",
    period: "2024 - Present",
    description: "Merancang desain web/mobile interaktif, wireframing, high-fidelity UI, serta aset ilustrasi vektor untuk klien internasional.",
    type: "Freelance"
  },
  {
    id: 'e3',
    role: "Mahasiswa Sains Informasi",
    company: "Universitas Padjadjaran",
    period: "2023 - Present",
    description: "Mempelajari analisis data informasi, arsitektur informasi, interaksi manusia dan komputer (HCI), rekayasa web, serta perancangan sistem informasi.",
    type: "Education"
  }
];

const defaultCertificates: Certificate[] = [
  {
    id: 'c1',
    title: "Certified Web Developer Specialist",
    year: "2025",
    issuer: "Dicoding Indonesia",
    thumbnailUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
    pdfUrl: "#"
  },
  {
    id: 'c2',
    title: "Google UI/UX Professional Certificate",
    year: "2025",
    issuer: "Coursera (Google)",
    thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    pdfUrl: "#"
  },
  {
    id: 'c3',
    title: "Full Stack React Native & Web Developer",
    year: "2024",
    issuer: "Udemy Academy",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    pdfUrl: "#"
  }
];

const defaultMessages: Message[] = [
  {
    id: 'm1',
    name: "Alex Johnson",
    email: "alex@example.com",
    subject: "Tawaran Freelance Web Developer",
    message: "Halo Rifky, saya melihat portofolio Anda dan sangat terkesan dengan desain minimalisnya. Kami sedang mencari seorang freelance frontend developer untuk mendesain ulang website agensi kami. Apakah Anda tertarik?",
    createdAt: "2026-07-14T10:00:00Z",
    read: false
  },
  {
    id: 'm2',
    name: "Sarah Amalia",
    email: "sarah.amalia@startup.id",
    subject: "Undangan Interview Magang",
    message: "Selamat siang Muhamad Rifky Hafan. Berdasarkan portofolio dan profil Anda, kami mengundang Anda untuk mengikuti interview magang posisi Frontend Dev di startup kami. Silakan hubungi kami kembali.",
    createdAt: "2026-07-12T14:30:00Z",
    read: true
  }
];

// LocalStorage Helper functions
const loadLocal = (key: string, defaultValue: any) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return defaultValue;
  }
};

const saveLocal = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initialize LocalStorage arrays
if (!localStorage.getItem('rifky_auth_user')) {
  localStorage.setItem('rifky_auth_user', JSON.stringify(null));
}

export const dbService = {
  // Check Mode
  isCloudMode(): boolean {
    return isFirebaseConfigured;
  },

  // Auth Functions
  async login(email: string, password: string): Promise<any> {
    // Firebase auth is bypassed for now as requested
    if (email === "admin@rifky.com" && password === "rifkyhafan2026") {
      const dummyUser = { email, uid: 'rifky-admin-uid', displayName: 'Muhamad Rifky Hafan' };
      saveLocal('rifky_auth_user', dummyUser);
      return dummyUser;
    } else {
      throw new Error("Email atau password admin salah! Gunakan: admin@rifky.com / rifkyhafan2026");
    }
  },

  async logout(): Promise<void> {
    saveLocal('rifky_auth_user', null);
  },

  async getCurrentUser(): Promise<any> {
    return loadLocal('rifky_auth_user', null);
  },

  onAuthChanged(callback: (user: any) => void) {
    // Simulated auth state observer
    const interval = setInterval(() => {
      const user = loadLocal('rifky_auth_user', null);
      callback(user);
    }, 1000);
    return () => clearInterval(interval);
  },

  // Profile CRUD
  async getProfile(): Promise<Profile> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "profile", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Profile;
      } else {
        return {
          name: "", title: "", subtitle: "", description: "", avatarUrl: "", bio: "", education: "", passion: "", careerObjective: "", resumeUrl: ""
        } as Profile;
      }
    } else {
      return loadLocal('rifky_profile', defaultProfile);
    }
  },

  async updateProfile(profile: Profile): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "profile", "main");
      await setDoc(docRef, profile, { merge: true });
    } else {
      saveLocal('rifky_profile', profile);
    }
  },

  // Settings CRUD
  async getSettings(): Promise<Settings> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "settings", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Settings;
      } else {
        return {
          websiteTitle: "My Portfolio", logoText: "Portfolio", resumeLink: "", linkedinUrl: "", githubUrl: "", instagramUrl: "", emailAddress: "", whatsappNumber: "", metaDescription: "", heroText: ""
        } as Settings;
      }
    } else {
      return loadLocal('rifky_settings', defaultSettings);
    }
  },

  async updateSettings(settings: Settings): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "settings", "main");
      await setDoc(docRef, settings, { merge: true });
    } else {
      saveLocal('rifky_settings', settings);
    }
  },

  // Chatbot Settings CRUD
  async getChatbotSettings(): Promise<ChatbotSettings> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "chatbot_settings", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as ChatbotSettings;
      } else {
        return defaultChatbotSettings;
      }
    } else {
      return loadLocal('rifky_chatbot_settings', defaultChatbotSettings);
    }
  },

  async updateChatbotSettings(settings: ChatbotSettings): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "chatbot_settings", "main");
      await setDoc(docRef, settings, { merge: true });
    } else {
      saveLocal('rifky_chatbot_settings', settings);
    }
  },

  // Projects CRUD
  async getProjects(): Promise<Project[]> {
    if (isFirebaseConfigured && firestore) {
      const colRef = collection(firestore, "projects");
      const q = query(colRef, orderBy("year", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Project[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Project);
      });
      return list;
    } else {
      return loadLocal('rifky_projects', defaultProjects);
    }
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const id = 'p_' + Date.now().toString();
    const newProj = { id, ...project };
    if (isFirebaseConfigured && firestore) {
      await setDoc(doc(firestore, "projects", id), project);
    } else {
      const list = await this.getProjects();
      list.push(newProj);
      saveLocal('rifky_projects', list);
    }
    return newProj;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "projects", id);
      await updateDoc(docRef, project);
    } else {
      const list = await this.getProjects();
      const updated = list.map(item => item.id === id ? { ...item, ...project } as Project : item);
      saveLocal('rifky_projects', updated);
    }
  },

  async deleteProject(id: string): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "projects", id);
      await deleteDoc(docRef);
    } else {
      const list = await this.getProjects();
      const filtered = list.filter(item => item.id !== id);
      saveLocal('rifky_projects', filtered);
    }
  },

  // Skills CRUD
  async getSkills(): Promise<Skill[]> {
    if (isFirebaseConfigured && firestore) {
      const colRef = collection(firestore, "skills");
      const querySnapshot = await getDocs(colRef);
      const list: Skill[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Skill);
      });
      return list;
    } else {
      return loadLocal('rifky_skills', defaultSkills);
    }
  },

  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const id = 's_' + Date.now().toString();
    const newSkill = { id, ...skill };
    if (isFirebaseConfigured && firestore) {
      await setDoc(doc(firestore, "skills", id), skill);
    } else {
      const list = await this.getSkills();
      list.push(newSkill);
      saveLocal('rifky_skills', list);
    }
    return newSkill;
  },

  async updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "skills", id);
      await updateDoc(docRef, skill);
    } else {
      const list = await this.getSkills();
      const updated = list.map(item => item.id === id ? { ...item, ...skill } as Skill : item);
      saveLocal('rifky_skills', updated);
    }
  },

  async deleteSkill(id: string): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "skills", id);
      await deleteDoc(docRef);
    } else {
      const list = await this.getSkills();
      const filtered = list.filter(item => item.id !== id);
      saveLocal('rifky_skills', filtered);
    }
  },

  // Experiences CRUD
  async getExperiences(): Promise<Experience[]> {
    if (isFirebaseConfigured && firestore) {
      const colRef = collection(firestore, "experience");
      const querySnapshot = await getDocs(colRef);
      const list: Experience[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Experience);
      });
      return list;
    } else {
      return loadLocal('rifky_experience', defaultExperiences);
    }
  },

  async createExperience(experience: Omit<Experience, 'id'>): Promise<Experience> {
    const id = 'e_' + Date.now().toString();
    const newExp = { id, ...experience };
    if (isFirebaseConfigured && firestore) {
      await setDoc(doc(firestore, "experience", id), experience);
    } else {
      const list = await this.getExperiences();
      list.push(newExp);
      saveLocal('rifky_experience', list);
    }
    return newExp;
  },

  async updateExperience(id: string, experience: Partial<Experience>): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "experience", id);
      await updateDoc(docRef, experience);
    } else {
      const list = await this.getExperiences();
      const updated = list.map(item => item.id === id ? { ...item, ...experience } as Experience : item);
      saveLocal('rifky_experience', updated);
    }
  },

  async deleteExperience(id: string): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "experience", id);
      await deleteDoc(docRef);
    } else {
      const list = await this.getExperiences();
      const filtered = list.filter(item => item.id !== id);
      saveLocal('rifky_experience', filtered);
    }
  },

  // Certificates CRUD
  async getCertificates(): Promise<Certificate[]> {
    if (isFirebaseConfigured && firestore) {
      const colRef = collection(firestore, "certificates");
      const querySnapshot = await getDocs(colRef);
      const list: Certificate[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Certificate);
      });
      return list;
    } else {
      return loadLocal('rifky_certificates', defaultCertificates);
    }
  },

  async createCertificate(cert: Omit<Certificate, 'id'>): Promise<Certificate> {
    const id = 'c_' + Date.now().toString();
    const newCert = { id, ...cert };
    if (isFirebaseConfigured && firestore) {
      await setDoc(doc(firestore, "certificates", id), cert);
    } else {
      const list = await this.getCertificates();
      list.push(newCert);
      saveLocal('rifky_certificates', list);
    }
    return newCert;
  },

  async updateCertificate(id: string, cert: Partial<Certificate>): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "certificates", id);
      await updateDoc(docRef, cert);
    } else {
      const list = await this.getCertificates();
      const updated = list.map(item => item.id === id ? { ...item, ...cert } as Certificate : item);
      saveLocal('rifky_certificates', updated);
    }
  },

  async deleteCertificate(id: string): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "certificates", id);
      await deleteDoc(docRef);
    } else {
      const list = await this.getCertificates();
      const filtered = list.filter(item => item.id !== id);
      saveLocal('rifky_certificates', filtered);
    }
  },


  // Messages CRUD
  async getMessages(): Promise<Message[]> {
    if (isFirebaseConfigured && firestore) {
      const colRef = collection(firestore, "messages");
      const q = query(colRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Message[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Message);
      });
      return list;
    } else {
      return loadLocal('rifky_messages', defaultMessages);
    }
  },

  async createMessage(msg: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> {
    const id = 'm_' + Date.now().toString();
    const newMsg: Message = { 
      id, 
      ...msg, 
      createdAt: new Date().toISOString(), 
      read: false 
    };
    if (isFirebaseConfigured && firestore) {
      await setDoc(doc(firestore, "messages", id), {
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        createdAt: newMsg.createdAt,
        read: false
      });
    } else {
      const list = await this.getMessages();
      list.unshift(newMsg); // Latest first
      saveLocal('rifky_messages', list);
    }
    return newMsg;
  },

  async markMessageAsRead(id: string, read: boolean = true): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "messages", id);
      await updateDoc(docRef, { read });
    } else {
      const list = await this.getMessages();
      const updated = list.map(item => item.id === id ? { ...item, read } : item);
      saveLocal('rifky_messages', updated);
    }
  },

  async deleteMessage(id: string): Promise<void> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, "messages", id);
      await deleteDoc(docRef);
    } else {
      const list = await this.getMessages();
      const filtered = list.filter(item => item.id !== id);
      saveLocal('rifky_messages', filtered);
    }
  },

  // File Upload Helper (e.g. Images or PDFs)
  async uploadFile(file: File, path: string): Promise<string> {
    // Cloudinary Credentials (using the ones provided and verified earlier)
    const CLOUD_NAME = "jbzy4h0h";
    const API_KEY = "794676683839476";
    const API_SECRET = "YX61bdk8tVz1Hlk_zQNoqRgQpk4";

    try {
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      
      // Determine folder from path (e.g., 'uploads/projects/xyz.png' -> 'portfolio/projects')
      const folder = "portfolio_uploads";
      
      // Create signature string (parameters must be alphabetical)
      const signatureString = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
      
      // Generate SHA-1 signature using Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(signatureString);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", API_KEY);
      formData.append("timestamp", timestamp);
      formData.append("folder", folder);
      formData.append("signature", signature);

      // We use 'auto' resource_type to handle both images and other files
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      
      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error(result.error?.message || "Cloudinary upload failed");
      }
    } catch (error) {
      console.error("Cloudinary Upload error, falling back to local base64:", error);
      // Offline mock upload converting file to base64 for previewing
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }
};
