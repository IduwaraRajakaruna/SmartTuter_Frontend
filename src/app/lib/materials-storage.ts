import { StudyMaterial } from '@/app/lib/mock-data';

const STORAGE_KEY = 'smarttuter.studyMaterials';

const safeParse = (value: string | null): StudyMaterial[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as StudyMaterial[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to parse stored materials', error);
    return [];
  }
};

export const getStoredMaterials = (): StudyMaterial[] => {
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

export const setStoredMaterials = (materials: StudyMaterial[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
};

export const addMaterial = (material: StudyMaterial): StudyMaterial[] => {
  const materials = getStoredMaterials();
  const updated = [material, ...materials];
  setStoredMaterials(updated);
  return updated;
};

export const removeMaterial = (materialId: string): StudyMaterial[] => {
  const updated = getStoredMaterials().filter((material) => material.id !== materialId);
  setStoredMaterials(updated);
  return updated;
};

export const seedMaterials = (materials: StudyMaterial[]): StudyMaterial[] => {
  const existing = getStoredMaterials();
  if (existing.length > 0) return existing;
  setStoredMaterials(materials);
  return materials;
};
