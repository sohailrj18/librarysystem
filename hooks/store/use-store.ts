import { User } from "@prisma/client";
import { create } from "zustand";

type PublicUser = Pick<User, "username" | "role" | "id" | "fullName">;

type UserStore = {
  user: PublicUser | null;
  setUser: (user: PublicUser) => void;
  logout: () => void;
};

type LoadingStore = {
  isLoading: boolean;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: PublicUser) => {
    set({ user });
  },
  logout: () => set({ user: null }),
}));

export const useLoadingStore = create<LoadingStore>(() => ({
  isLoading: false,
}));
