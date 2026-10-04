import { KhatmahProgress, KhatmahJuzClaim, CollectiveTasbihItem, LegacyDeed } from '../types';

const INITIAL_TASBIH_ITEMS: CollectiveTasbihItem[] = [
  {
    id: 't-1',
    title: 'أستغفر الله العظيم وأتوب إليه',
    targetCount: 10000,
    currentCount: 1420,
    virtue: '«مَن لَزِمَ الاستغفارَ جَعَلَ اللهُ له من كلِّ هَمٍّ فَرَجاً، ومن كلِّ ضيقٍ مَخْرَجاً»'
  },
  {
    id: 't-2',
    title: 'اللهم صلِّ وسلِّم وبارك على سيدنا محمد',
    targetCount: 10000,
    currentCount: 2350,
    virtue: '«مَن صلَّى عليَّ صلاةً صلَّى اللهُ عليه بها عشراً»'
  },
  {
    id: 't-3',
    title: 'سبحان الله وبحمده، سبحان الله العظيم',
    targetCount: 10000,
    currentCount: 3100,
    virtue: '«كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن»'
  },
  {
    id: 't-4',
    title: 'لا إله إلا الله وحده لا شريك له',
    targetCount: 5000,
    currentCount: 1840,
    virtue: 'أفضل ما قاله النبيون، ومفتاح الجنة وعصمة من النار'
  },
  {
    id: 't-5',
    title: 'قراءة سورة الإخلاص (ثُلث القرآن)',
    targetCount: 1000,
    currentCount: 430,
    virtue: '«قل هو الله أحد تعدل ثلث القرآن» ومن قرأها عشر مرات بنى الله له بيتاً في الجنة'
  }
];

const INITIAL_LEGACY_DEEDS: LegacyDeed[] = [
  {
    id: 'ld-1',
    title: 'سقيا الماء وإطعام الطير والحيوان',
    description: 'كان الفقيد يحرص على وضع الماء النقي وبذور الطعام في الشرفات وبجانب الطريق، «في كل كبد رطبة أجر».',
    completedCount: 38,
    category: 'charity'
  },
  {
    id: 'ld-2',
    title: 'صِلة أصدقائه وأقاربه وتفقد أحوالهم',
    description: '«إن أبر البر صلة الولد أهل ود أبيه بعد أن يولي»، تفقد محبيه ومهاتفتهم وإدخال السرور على قلوبهم.',
    completedCount: 24,
    category: 'family'
  },
  {
    id: 'ld-3',
    title: 'الصدقة الخفية في السر عن روحه',
    description: 'إخراج مبلغ بسيط ولو جنيهاً واحداً بنية الصدقة الجارية عن روحه لفقير أو مسكين متعفف.',
    completedCount: 57,
    category: 'charity'
  },
  {
    id: 'ld-4',
    title: 'صلاة ركعتين في جوف الليل والدعاء له',
    description: 'القيام في الثلث الأخير من الليل ومناجاة الله بالمغفرة للفقيد وسكنى الفردوس الأعلى.',
    completedCount: 42,
    category: 'worship'
  },
  {
    id: 'ld-5',
    title: 'الكلمة الطيبة والتبسم ونشر الأثر الحسن',
    description: 'التعامل بالحلم والسماحة ونشر خُلق العفو الذي كان يحبه ويعيش به بين الناس.',
    completedCount: 65,
    category: 'kindness'
  }
];

export const religiousFeaturesService = {
  // 1. Khatmah Progress
  getKhatmahProgress(memorialId: string): KhatmahProgress {
    const key = `athar_khatmah_${memorialId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    // Default seeded progress: e.g. 11 Juzs already completed in Khatmah 1
    const defaultClaims: Record<number, KhatmahJuzClaim> = {};
    const seededCompleted = [1, 2, 3, 4, 18, 19, 28, 29, 30];
    for (let i = 1; i <= 30; i++) {
      const isComp = seededCompleted.includes(i);
      defaultClaims[i] = {
        juzNumber: i,
        readerName: isComp ? 'محب فاعل خير' : undefined,
        isCompleted: isComp,
        completedAt: isComp ? new Date().toISOString() : undefined
      };
    }

    const initial: KhatmahProgress = {
      memorialId,
      khatmahNumber: 1,
      completedCount: seededCompleted.length,
      claims: defaultClaims,
      totalCompletedKhatmahs: 0
    };

    try {
      localStorage.setItem(key, JSON.stringify(initial));
    } catch {}

    return initial;
  },

  claimJuz(memorialId: string, juzNumber: number, readerName: string): KhatmahProgress {
    const progress = this.getKhatmahProgress(memorialId);
    progress.claims[juzNumber] = {
      juzNumber,
      readerName: readerName.trim() || 'فاعل خير',
      isCompleted: false,
      claimedAt: new Date().toISOString()
    };
    this.saveKhatmahProgress(progress);
    return progress;
  },

  completeJuz(memorialId: string, juzNumber: number, readerName?: string): { progress: KhatmahProgress; justFinishedKhatmah: boolean } {
    const progress = this.getKhatmahProgress(memorialId);
    const existing = progress.claims[juzNumber] || { juzNumber, isCompleted: false };
    
    if (!existing.isCompleted) {
      existing.isCompleted = true;
      existing.readerName = readerName?.trim() || existing.readerName || 'محب للفقيد';
      existing.completedAt = new Date().toISOString();
      progress.claims[juzNumber] = existing;
      progress.completedCount = Object.values(progress.claims).filter(c => c.isCompleted).length;
    }

    let justFinishedKhatmah = false;
    // If all 30 are complete, advance to next Khatmah!
    if (progress.completedCount >= 30) {
      justFinishedKhatmah = true;
      progress.totalCompletedKhatmahs += 1;
      progress.khatmahNumber += 1;
      progress.completedCount = 0;
      // Reset claims for new khatmah
      const newClaims: Record<number, KhatmahJuzClaim> = {};
      for (let i = 1; i <= 30; i++) {
        newClaims[i] = { juzNumber: i, isCompleted: false };
      }
      progress.claims = newClaims;
    }

    this.saveKhatmahProgress(progress);
    return { progress, justFinishedKhatmah };
  },

  saveKhatmahProgress(progress: KhatmahProgress) {
    try {
      localStorage.setItem(`athar_khatmah_${progress.memorialId}`, JSON.stringify(progress));
    } catch {}
  },

  // 2. Collective Tasbih
  getTasbihItems(memorialId: string): CollectiveTasbihItem[] {
    const key = `athar_tasbih_${memorialId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    try {
      localStorage.setItem(key, JSON.stringify(INITIAL_TASBIH_ITEMS));
    } catch {}
    return INITIAL_TASBIH_ITEMS;
  },

  incrementTasbih(memorialId: string, itemId: string, amount: number = 1): CollectiveTasbihItem[] {
    const items = this.getTasbihItems(memorialId);
    const updated = items.map(item => {
      if (item.id === itemId) {
        return { ...item, currentCount: item.currentCount + amount };
      }
      return item;
    });
    try {
      localStorage.setItem(`athar_tasbih_${memorialId}`, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // 3. Living Legacy Deeds
  getLegacyDeeds(memorialId: string): LegacyDeed[] {
    const key = `athar_legacy_${memorialId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    try {
      localStorage.setItem(key, JSON.stringify(INITIAL_LEGACY_DEEDS));
    } catch {}
    return INITIAL_LEGACY_DEEDS;
  },

  recordDeedPractice(memorialId: string, deedId: string): LegacyDeed[] {
    const deeds = this.getLegacyDeeds(memorialId);
    const updated = deeds.map(d => {
      if (d.id === deedId) {
        return { ...d, completedCount: d.completedCount + 1 };
      }
      return d;
    });
    try {
      localStorage.setItem(`athar_legacy_${memorialId}`, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  addCustomLegacyDeed(memorialId: string, title: string, description: string, category: 'charity' | 'kindness' | 'worship' | 'family'): LegacyDeed[] {
    const deeds = this.getLegacyDeeds(memorialId);
    const newDeed: LegacyDeed = {
      id: 'custom_' + Date.now().toString(36),
      title: title.trim(),
      description: description.trim(),
      completedCount: 1,
      category
    };
    const updated = [newDeed, ...deeds];
    try {
      localStorage.setItem(`athar_legacy_${memorialId}`, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // 4. Calculate Total Blossom Score (for Virtue Tree)
  getTotalVirtueScore(memorialId: string, prayerCount: number = 0): number {
    const tasbih = this.getTasbihItems(memorialId);
    const totalTasbih = tasbih.reduce((acc, curr) => acc + curr.currentCount, 0);
    const khatmah = this.getKhatmahProgress(memorialId);
    const juzCompleted = khatmah.completedCount + (khatmah.totalCompletedKhatmahs * 30);
    const deeds = this.getLegacyDeeds(memorialId);
    const totalDeeds = deeds.reduce((acc, curr) => acc + curr.completedCount, 0);

    // Each action has weighted impact
    return Math.floor(prayerCount * 3 + juzCompleted * 20 + totalTasbih / 50 + totalDeeds * 5);
  }
};
