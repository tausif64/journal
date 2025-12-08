'use client';

import { ApiSessionResponse } from '@/types/dto';
import { create } from 'zustand';

// 1. Define the store interface
interface UserStore {
    session: ApiSessionResponse | null;
    setSession: (session: ApiSessionResponse | null) => void;
}

// 2. Create the store with type annotation
export const useUserStore = create<UserStore>((set) => ({
    session: null,
    setSession: (session) => set({ session }),
    
}));
