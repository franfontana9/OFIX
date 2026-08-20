import { create } from "zustand";
import { store } from "./store";
import type { AuthProvider, ClientType, PublicUser, Role, Verification } from "./types";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  photo?: string;
  authProvider?: AuthProvider;
  clientType?: ClientType;
  zone?: string;
  trade?: string;
  trades?: string[];
  coverageZone?: string;
  hourlyRate?: number;
  bio?: string;
  verification?: Verification;
}

interface AuthState {
  user: PublicUser | null;
  token: string | null;
  isAuthenticated: boolean;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<PublicUser>) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  initialize: () => {
    const u = store.getCurrentUser();
    if (u) set({ user: u, isAuthenticated: true });
  },
  login: async (email, password) => {
    const { user } = store.login(email, password);
    set({ user, token: localStorage.getItem("ofix-token"), isAuthenticated: true });
  },
  register: async (data) => {
    const { user } = store.register(data);
    set({ user, token: localStorage.getItem("ofix-token"), isAuthenticated: true });
  },
  logout: () => {
    store.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: async (patch) => {
    const { user } = get();
    if (!user) throw new Error("No autenticado");
    const updated = store.updateUser(user.id, patch);
    set({ user: updated });
  },
}));
