import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  currentUser: CompanyUser | null;
  setCurrentUser: (user: CompanyUser) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    {
      name: "user-storage", // Nom du stockage dans localStorage
    }
  )
);
