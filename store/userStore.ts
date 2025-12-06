'use client';

import { create } from 'zustand';
import { Session, User } from 'better-auth';

type ApiSessionResponse = {
    session: Session,
    user: User
}

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
