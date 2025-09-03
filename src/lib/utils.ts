import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  };
  
  return new Intl.DateTimeFormat('es-CL', { ...defaultOptions, ...options }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  }).format(date);
};

export const formatDateOnly = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Santiago',
  }).format(date);
};

// Validation utilities
export const validateRUT = (rut: string): boolean => {
  // Remove dots and dash
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Check if it's a valid RUT format
  if (!/^[0-9]{7,8}[0-9kK]$/.test(cleanRut)) {
    return false;
  }
  
  // Extract number and check digit
  const number = cleanRut.slice(0, -1);
  const checkDigit = cleanRut.slice(-1).toLowerCase();
  
  // Calculate check digit
  let sum = 0;
  let multiplier = 2;
  
  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedCheckDigit = 11 - (sum % 11);
  const calculatedCheckDigit = expectedCheckDigit === 11 ? '0' : expectedCheckDigit === 10 ? 'k' : expectedCheckDigit.toString();
  
  return checkDigit === calculatedCheckDigit;
};

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

// Array utilities
export const groupBy = <T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// Error handling utilities
export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Ha ocurrido un error inesperado';
};

// Color utilities for categories
export const getCategoryColor = (categoria: string): string => {
  switch (categoria) {
    case 'OPERADO':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PENDIENTE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'NO_QUIRURGICO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'NOVEDAD':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityColor = (prioridad: string): string => {
  switch (prioridad) {
    case 'URGENTE':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PROGRAMABLE':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
