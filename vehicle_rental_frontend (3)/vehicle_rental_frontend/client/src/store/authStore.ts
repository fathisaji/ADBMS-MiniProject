import { create } from "zustand";

interface User {
    userId: number;
    role: "ADMIN" | "CUSTOMER";
    fullName?: string;
}

interface AuthStore {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },
    clearUser: () => {
        localStorage.removeItem("user");
        set({ user: null });
    },
}));
