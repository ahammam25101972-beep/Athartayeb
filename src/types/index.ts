export interface CharityProject {
  id: string;
  title: string;
  description: string;
  organizationName: string;
  url?: string;
  category: 'water' | 'mosque' | 'orphan' | 'quran' | 'food' | 'waqf' | 'other';
}

export interface Memorial {
  id: string;
  userId: string;
  deceasedName: string;
  titlePrefix?: string; // e.g. "المغفور له بإذن الله", "المرحوم", "المرحومة"
  photoUrl?: string;
  dateOfDeath?: string;
  hijriDate?: string;
  cityOrCountry?: string;
  summary?: string;
  customDuaa?: string;
  charityProjects?: CharityProject[];
  galleryImages?: string[];
  visitCount: number;
  prayerCount: number;
  isPublished: boolean;
  isSuspended: boolean;
  allowPublicDuaa: boolean;
  createdAt: string;
  updatedAt: string;
  creatorName?: string;
  // Domain configuration (دومين خاص باسم المتوفى بسعر 200 ج)
  domainType?: 'custom';
  customDomain?: string; // e.g. "www.mohamed-ahmed.com" (بسعر 200 جنيه)
}

export interface Prayer {
  id: string;
  memorialId: string;
  authorName: string;
  duaaText: string;
  isHidden?: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  memorialId: string;
  memorialName: string;
  reporterName: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  ayahsCount: number;
  revelationType: 'مكية' | 'مدنية';
  virtue?: string;
  verses: {
    number: number;
    text: string;
  }[];
}

export interface DhikrItem {
  id: string;
  category: 'sabah' | 'masaa' | 'nawm' | 'dead' | 'general';
  text: string;
  translationOrNote?: string;
  targetCount: number;
  source: string;
}

// 1. Khatmah Types (ختمة القرآن لروح المتوفى)
export interface KhatmahJuzClaim {
  juzNumber: number; // 1..30
  readerName?: string;
  isCompleted: boolean;
  claimedAt?: string;
  completedAt?: string;
}

export interface KhatmahProgress {
  memorialId: string;
  khatmahNumber: number;
  completedCount: number; // 0..30
  claims: Record<number, KhatmahJuzClaim>;
  totalCompletedKhatmahs: number;
}

// 2. Collective Tasbih Types (السبحة الجماعية)
export interface CollectiveTasbihItem {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  virtue: string;
}

// 3. Living Legacy & Good Deeds Types (سجل وصايا وأثر الفقيد)
export interface LegacyDeed {
  id: string;
  title: string;
  description: string;
  completedCount: number;
  category: 'charity' | 'kindness' | 'worship' | 'family';
}

// 4. Classified Duas (مكتبة الأدعية المأثورة المصنفة)
export interface ClassifiedDuaa {
  id: string;
  category: 'father' | 'mother' | 'children' | 'general' | 'graves' | 'virtues';
  categoryLabel: string;
  title: string;
  text: string;
  source: string;
}

