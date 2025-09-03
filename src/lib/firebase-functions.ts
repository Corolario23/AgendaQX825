// Mock Firebase Functions for now
// TODO: Replace with actual Firebase Functions setup
export const functions = {
  httpsCallable: (name: string) => async (data?: any) => {
    // Mock implementation
    return { data: null };
  },
} as any;

// Mock emulator connection
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
    console.log('🔥 Mock Firebase Functions emulator connected');
  }
}
