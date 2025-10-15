import { Hosting } from '@/types/hosting';

const STORAGE_KEY = 'hosting_manager_data';
const ENCRYPTION_KEY = 'hosting_secure_key_v1'; // في الإنتاج، استخدم Web Crypto API

// تشفير بسيط (للإنتاج استخدم Web Crypto API)
function simpleEncrypt(text: string): string {
  return btoa(encodeURIComponent(text));
}

function simpleDecrypt(encrypted: string): string {
  try {
    return decodeURIComponent(atob(encrypted));
  } catch {
    return encrypted;
  }
}

export function saveHostings(hostings: Hosting[]): void {
  try {
    const encryptedHostings = hostings.map(h => ({
      ...h,
      password: simpleEncrypt(h.password),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedHostings));
  } catch (error) {
    console.error('Error saving hostings:', error);
    throw new Error('فشل حفظ البيانات');
  }
}

export function loadHostings(): Hosting[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const hostings = JSON.parse(data);
    return hostings.map((h: Hosting) => ({
      ...h,
      password: simpleDecrypt(h.password),
    }));
  } catch (error) {
    console.error('Error loading hostings:', error);
    return [];
  }
}

export function exportHostings(): string {
  const hostings = loadHostings();
  return JSON.stringify(hostings, null, 2);
}

export function importHostings(jsonData: string): Hosting[] {
  try {
    const hostings = JSON.parse(jsonData);
    if (!Array.isArray(hostings)) {
      throw new Error('البيانات غير صالحة');
    }
    
    // التحقق من صحة البيانات
    const validHostings = hostings.filter(h => 
      h.name && h.url && h.username && h.type
    );
    
    if (validHostings.length === 0) {
      throw new Error('لا توجد بيانات صالحة للاستيراد');
    }
    
    return validHostings;
  } catch (error) {
    console.error('Error importing hostings:', error);
    throw new Error('فشل استيراد البيانات');
  }
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
