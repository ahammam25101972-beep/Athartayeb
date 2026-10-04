import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  limit, 
  increment 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Memorial, Prayer, Report } from '../types';
import { DEMO_MEMORIALS, DEMO_PRAYERS } from '../data/demoMemorials';

const LOCAL_STORAGE_KEY_MEMORIALS = 'athar_tayyib_memorials_cache';
const LOCAL_STORAGE_KEY_PRAYERS = 'athar_tayyib_prayers_cache';
const LOCAL_STORAGE_KEY_REPORTS = 'athar_tayyib_reports_cache';

export function cleanDeceasedName(name: string): string {
  if (!name) return '';
  return name
    .replace(/\s*[\(\[\{]?\s*(نموذج\s*تجريب[يى]|ديمو|Demo|demo|تجريب[يى]|صفحة\s*تجريبية)\s*[\)\]\}]?/gi, '')
    .trim();
}

export function sanitizeMemorial(m: Memorial): Memorial {
  if (!m) return m;
  return {
    ...m,
    deceasedName: cleanDeceasedName(m.deceasedName),
    summary: m.summary ? m.summary.replace(/نموذج تجريب[يى]|ديمو|Demo|صفحة تجريبية/gi, '').trim() : m.summary,
  };
}

function getLocalMemorials(): Memorial[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_MEMORIALS);
    if (!raw) return [];
    const parsed: Memorial[] = JSON.parse(raw);
    const cleaned = parsed.map(sanitizeMemorial);
    if (JSON.stringify(cleaned) !== raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MEMORIALS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    return [];
  }
}

function saveLocalMemorials(list: Memorial[]) {
  try {
    const cleaned = list.map(sanitizeMemorial);
    localStorage.setItem(LOCAL_STORAGE_KEY_MEMORIALS, JSON.stringify(cleaned));
  } catch (e) {}
}

function getLocalPrayers(): Record<string, Prayer[]> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PRAYERS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalPrayers(map: Record<string, Prayer[]>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PRAYERS, JSON.stringify(map));
  } catch (e) {}
}

function getLocalReports(): Report[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalReports(reps: Report[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(reps));
  } catch (e) {}
}

function sanitizeData<T extends Record<string, any>>(data: T): Partial<T> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean as Partial<T>;
}

export const memorialService = {
  // Get all active and published memorials
  async getPublishedMemorials(): Promise<Memorial[]> {
    const localList = getLocalMemorials();
    let firestoreList: Memorial[] = [];

    try {
      const memorialsRef = collection(db, 'memorials');
      const q = query(memorialsRef, limit(40));
      const snapshot = await getDocs(q);
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Memorial;
        if (data && data.isPublished && !data.isSuspended) {
          firestoreList.push({ ...data, id: docSnap.id });
        }
      });
    } catch (error) {
      console.warn('Firestore fetch notice (using cache):', error);
    }

    // Merge Firestore + Local + Demo
    const mergedMap = new Map<string, Memorial>();
    
    // Add demo items first
    for (const d of DEMO_MEMORIALS) {
      mergedMap.set(d.id, d);
    }
    // Add local cached items
    for (const l of localList) {
      if (l.isPublished && !l.isSuspended) {
        mergedMap.set(l.id, l);
      }
    }
    // Add firestore items
    for (const f of firestoreList) {
      mergedMap.set(f.id, sanitizeMemorial(f));
    }

    return Array.from(mergedMap.values()).map(sanitizeMemorial);
  },

  // Get single memorial by ID
  async getMemorialById(id: string): Promise<Memorial | null> {
    // Check local storage first
    const localList = getLocalMemorials();
    const local = localList.find(m => m.id === id);
    if (local) return sanitizeMemorial(local);

    // Check demo items
    const demo = DEMO_MEMORIALS.find(m => m.id === id);
    if (demo) return sanitizeMemorial(demo);

    // Fetch from Firestore
    try {
      const docRef = doc(db, 'memorials', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = sanitizeMemorial({ ...(snap.data() as Memorial), id: snap.id });
        // Cache locally
        saveLocalMemorials([...localList, data]);
        return data;
      }
      return null;
    } catch (error) {
      console.warn('Error fetching memorial doc:', error);
      return null;
    }
  },

  // Get user's own created memorials
  async getUserMemorials(userId: string): Promise<Memorial[]> {
    const localList = getLocalMemorials().filter(m => m.userId === userId);

    try {
      const snapshot = await getDocs(collection(db, 'memorials'));
      const fsList: Memorial[] = [];
      snapshot.forEach(d => {
        const data = d.data() as Memorial;
        if (data.userId === userId) {
          fsList.push({ ...data, id: d.id });
        }
      });

      const map = new Map<string, Memorial>();
      for (const m of localList) map.set(m.id, sanitizeMemorial(m));
      for (const m of fsList) map.set(m.id, sanitizeMemorial(m));
      return Array.from(map.values()).map(sanitizeMemorial);
    } catch (error) {
      return localList.map(sanitizeMemorial);
    }
  },

  // Create new memorial
  async createMemorial(memorial: Omit<Memorial, 'visitCount' | 'prayerCount' | 'isSuspended'>): Promise<Memorial> {
    const newMemorial: Memorial = {
      ...memorial,
      visitCount: 0,
      prayerCount: 0,
      isSuspended: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save locally first so user never loses their data
    const localList = getLocalMemorials();
    saveLocalMemorials([newMemorial, ...localList]);

    // Save to Firestore
    try {
      const cleanData = sanitizeData(newMemorial);
      await setDoc(doc(db, 'memorials', memorial.id), cleanData);
    } catch (error) {
      console.warn('Saved to local storage, Firestore sync error:', error);
    }

    return newMemorial;
  },

  // Update existing memorial
  async updateMemorial(id: string, updates: Partial<Memorial>): Promise<void> {
    const localList = getLocalMemorials();
    const idx = localList.findIndex(m => m.id === id);
    if (idx !== -1) {
      localList[idx] = { ...localList[idx], ...updates, updatedAt: new Date().toISOString() };
      saveLocalMemorials(localList);
    }

    if (id.startsWith('demo-')) {
      const demo = DEMO_MEMORIALS.find(m => m.id === id);
      if (demo) Object.assign(demo, updates);
      const existingLocalIdx = localList.findIndex(m => m.id === id);
      if (existingLocalIdx >= 0) {
        localList[existingLocalIdx] = { ...localList[existingLocalIdx], ...updates };
      } else if (demo) {
        localList.push({ ...demo, ...updates });
      }
      saveLocalMemorials(localList);
      return;
    }

    try {
      const cleanUpdates = sanitizeData({
        ...updates,
        updatedAt: new Date().toISOString()
      });
      await updateDoc(doc(db, 'memorials', id), cleanUpdates);
    } catch (error) {
      console.warn('Updated locally, Firestore update error:', error);
    }
  },

  // Delete memorial
  async deleteMemorial(id: string): Promise<void> {
    const localList = getLocalMemorials().filter(m => m.id !== id);
    saveLocalMemorials(localList);

    if (id.startsWith('demo-')) {
      const idx = DEMO_MEMORIALS.findIndex(m => m.id === id);
      if (idx !== -1) DEMO_MEMORIALS.splice(idx, 1);
      return;
    }

    try {
      await deleteDoc(doc(db, 'memorials', id));
    } catch (error) {
      console.warn('Deleted locally, Firestore delete error:', error);
    }
  },

  // Record a page visit (increment visitCount)
  async incrementVisit(id: string): Promise<void> {
    const localList = getLocalMemorials();
    const mem = localList.find(m => m.id === id);
    if (mem) {
      mem.visitCount = (mem.visitCount || 0) + 1;
      saveLocalMemorials(localList);
    }

    if (id.startsWith('demo-')) {
      const demo = DEMO_MEMORIALS.find(m => m.id === id);
      if (demo) demo.visitCount = (demo.visitCount || 0) + 1;
      return;
    }

    try {
      await updateDoc(doc(db, 'memorials', id), {
        visitCount: increment(1)
      });
    } catch (error) {}
  },

  // Add a prayer to memorial
  async addPrayer(memorialId: string, authorName: string, duaaText: string): Promise<Prayer> {
    const prayerId = 'pr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newPrayer: Prayer = {
      id: prayerId,
      memorialId,
      authorName: authorName.trim() || 'فاعل خير',
      duaaText: duaaText.trim(),
      isHidden: false,
      createdAt: new Date().toISOString()
    };

    // Save locally
    const prayersMap = getLocalPrayers();
    if (!prayersMap[memorialId]) prayersMap[memorialId] = [];
    prayersMap[memorialId].unshift(newPrayer);
    saveLocalPrayers(prayersMap);

    // Update memorial counter locally
    const localList = getLocalMemorials();
    const mem = localList.find(m => m.id === memorialId);
    if (mem) {
      mem.prayerCount = (mem.prayerCount || 0) + 1;
      saveLocalMemorials(localList);
    }

    if (memorialId.startsWith('demo-')) {
      if (!DEMO_PRAYERS[memorialId]) DEMO_PRAYERS[memorialId] = [];
      DEMO_PRAYERS[memorialId].unshift(newPrayer);
      const demo = DEMO_MEMORIALS.find(m => m.id === memorialId);
      if (demo) demo.prayerCount = (demo.prayerCount || 0) + 1;
      return newPrayer;
    }

    try {
      await setDoc(doc(db, 'memorials', memorialId, 'prayers', prayerId), sanitizeData(newPrayer));
      await updateDoc(doc(db, 'memorials', memorialId), {
        prayerCount: increment(1)
      });
    } catch (error) {
      console.warn('Prayer saved locally, Firestore error:', error);
    }

    return newPrayer;
  },

  // Get prayers for a memorial
  async getPrayers(memorialId: string): Promise<Prayer[]> {
    const prayersMap = getLocalPrayers();
    const localPrayers = prayersMap[memorialId] || [];

    if (memorialId.startsWith('demo-')) {
      const demoList = DEMO_PRAYERS[memorialId] || [];
      const map = new Map<string, Prayer>();
      for (const p of demoList) map.set(p.id, p);
      for (const p of localPrayers) map.set(p.id, p);
      return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    try {
      const prayersRef = collection(db, 'memorials', memorialId, 'prayers');
      const snap = await getDocs(query(prayersRef, limit(60)));
      const fsList: Prayer[] = [];
      snap.forEach(d => {
        fsList.push({ ...(d.data() as Prayer), id: d.id });
      });

      const map = new Map<string, Prayer>();
      for (const p of localPrayers) map.set(p.id, p);
      for (const p of fsList) map.set(p.id, p);
      return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      return localPrayers;
    }
  },

  // Moderate prayer visibility
  async togglePrayerVisibility(memorialId: string, prayerId: string, isHidden: boolean): Promise<void> {
    const prayersMap = getLocalPrayers();
    const list = prayersMap[memorialId];
    if (list) {
      const p = list.find(x => x.id === prayerId);
      if (p) {
        p.isHidden = isHidden;
        saveLocalPrayers(prayersMap);
      }
    }

    if (memorialId.startsWith('demo-')) {
      const dlist = DEMO_PRAYERS[memorialId];
      const dp = dlist?.find(x => x.id === prayerId);
      if (dp) dp.isHidden = isHidden;
      return;
    }

    try {
      await updateDoc(doc(db, 'memorials', memorialId, 'prayers', prayerId), {
        isHidden
      });
    } catch (error) {}
  },

  // Submit report for inappropriate content
  async submitReport(memorialId: string, memorialName: string, reporterName: string, reason: string, details?: string): Promise<void> {
    const reportId = 'rep_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newReport: Report = {
      id: reportId,
      memorialId,
      memorialName,
      reporterName: reporterName.trim() || 'زائر',
      reason,
      details: details?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const localReps = getLocalReports();
    saveLocalReports([newReport, ...localReps]);

    try {
      await setDoc(doc(db, 'reports', reportId), sanitizeData(newReport));
    } catch (error) {}
  },

  // Admin: Get all memorials including suspended
  async adminGetAllMemorials(): Promise<Memorial[]> {
    const localList = getLocalMemorials();
    try {
      const snap = await getDocs(collection(db, 'memorials'));
      const fsList: Memorial[] = [];
      snap.forEach(d => fsList.push({ ...(d.data() as Memorial), id: d.id }));
      
      const map = new Map<string, Memorial>();
      for (const d of DEMO_MEMORIALS) map.set(d.id, sanitizeMemorial(d));
      for (const l of localList) map.set(l.id, sanitizeMemorial(l));
      for (const f of fsList) map.set(f.id, sanitizeMemorial(f));
      return Array.from(map.values()).map(sanitizeMemorial);
    } catch (error) {
      const map = new Map<string, Memorial>();
      for (const d of DEMO_MEMORIALS) map.set(d.id, sanitizeMemorial(d));
      for (const l of localList) map.set(l.id, sanitizeMemorial(l));
      return Array.from(map.values()).map(sanitizeMemorial);
    }
  },

  // Admin: Toggle suspension of memorial
  async adminSetSuspension(memorialId: string, isSuspended: boolean): Promise<void> {
    const localList = getLocalMemorials();
    const mem = localList.find(m => m.id === memorialId);
    if (mem) {
      mem.isSuspended = isSuspended;
      saveLocalMemorials(localList);
    }

    if (memorialId.startsWith('demo-')) {
      const demo = DEMO_MEMORIALS.find(m => m.id === memorialId);
      if (demo) demo.isSuspended = isSuspended;
      return;
    }

    try {
      await updateDoc(doc(db, 'memorials', memorialId), {
        isSuspended,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {}
  },

  // Admin: Get all reports
  async adminGetReports(): Promise<Report[]> {
    const localReps = getLocalReports();
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const fsList: Report[] = [];
      snap.forEach(d => fsList.push({ ...(d.data() as Report), id: d.id }));
      
      const map = new Map<string, Report>();
      for (const r of localReps) map.set(r.id, r);
      for (const r of fsList) map.set(r.id, r);
      return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      return localReps;
    }
  },

  // Admin: Update report status
  async adminUpdateReportStatus(reportId: string, status: 'pending' | 'resolved' | 'dismissed'): Promise<void> {
    const localReps = getLocalReports();
    const r = localReps.find(x => x.id === reportId);
    if (r) {
      r.status = status;
      saveLocalReports(localReps);
    }

    try {
      await updateDoc(doc(db, 'reports', reportId), { status });
    } catch (error) {}
  }
};
