export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  avatarUrl: string;
  bio: string;
  education: string;
  passion: string;
  careerObjective: string;
  resumeUrl: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnailUrl: string;
  screenshots: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  category: 'Web Development' | 'Graphic Design' | 'Software Engineering' | string;
  year: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'UI/UX & Design' | string;
  iconName: string; // Lucide icon name or similar
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  type: 'Work' | 'Education' | 'Freelance' | string;
}

export interface Certificate {
  id: string;
  title: string;
  year: string;
  issuer: string;
  thumbnailUrl: string;
  pdfUrl: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Settings {
  websiteTitle: string;
  logoText: string;
  resumeLink: string;
  linkedinUrl: string;
  githubUrl: string;
  instagramUrl: string;
  emailAddress: string;
  whatsappNumber: string;
  metaDescription: string;
  heroText: string;
}

export interface ChatbotSettings {
  enabled: boolean;
  aiName: string;
  welcomeMessage: string;
  placeholderText: string;
  status: 'online' | 'offline' | 'busy';
  systemPrompt: string;
  model: string;
  maxTokens: number;
  temperature: number;
  faq: { question: string; answer: string }[];
  blockedTopics: string[];
}
