import { Class } from '@/app/lib/mock-data';

const STORAGE_KEY = 'smarttuter.classes';

const safeParse = (value: string | null): Class[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Class[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to parse stored classes', error);
    return [];
  }
};

export const getStoredClasses = (): Class[] => {
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

export const getTeacherClasses = (teacherId?: string): Class[] => {
  if (!teacherId) return [];
  return getStoredClasses().filter((classData) => classData.teacherId === teacherId);
};

export const getClassById = (classId: string): Class | undefined => {
  return getStoredClasses().find((classData) => classData.id === classId);
};

export const upsertClass = (classData: Class): Class[] => {
  const classes = getStoredClasses();
  const index = classes.findIndex((entry) => entry.id === classData.id);

  if (index >= 0) {
    classes[index] = classData;
  } else {
    classes.unshift(classData);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  return classes;
};
