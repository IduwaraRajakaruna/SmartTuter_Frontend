import { Payment, mockPayments } from '@/app/lib/mock-data';

const STORAGE_KEY = 'smarttuter.payments';

const safeParse = (value: string | null): Payment[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Payment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to parse stored payments', error);
    return [];
  }
};

export const getStoredPayments = (): Payment[] => {
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

export const setStoredPayments = (payments: Payment[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
};

export const addPayment = (payment: Payment): Payment[] => {
  const payments = getStoredPayments();
  const updated = [payment, ...payments];
  setStoredPayments(updated);
  return updated;
};

export const seedPayments = (): Payment[] => {
  const existing = getStoredPayments();
  if (existing.length > 0) return existing;
  setStoredPayments(mockPayments);
  return mockPayments;
};

export const clearPayments = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
