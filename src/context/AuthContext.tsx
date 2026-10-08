import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import {
  fetchUsersFromDb,
  upsertUserInDb,
  isSupabaseConfigured
} from '../lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (data: Omit<User, 'id' | 'memberSince'>) => { success: boolean; message?: string };
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  switchRole: (role: 'user' | 'admin') => void;
  usersList: User[];
  refreshUsersFromDb: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'capzone_users_v2';
const CURRENT_USER_KEY = 'capzone_current_user_v3';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const refreshUsersFromDb = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const dbUsers = await fetchUsersFromDb();
      if (dbUsers && dbUsers.length > 0) {
        setUsersList(dbUsers);
      }
    } catch (e) {
      console.warn('Could not load users from Supabase:', e);
    }
  };

  // Sync users with Supabase on mount
  useEffect(() => {
    refreshUsersFromDb();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error(e);
    }
  }, [usersList]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const login = (email: string, pass: string) => {
    const found = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'No account found with this email address.' };
    }
    if (found.password && found.password !== pass) {
      return { success: false, message: 'Incorrect password. Try "password123" for demo.' };
    }
    setCurrentUser(found);
    return { success: true };
  };

  const register = (data: Omit<User, 'id' | 'memberSince'>) => {
    const exists = usersList.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
      ...data,
      id: `usr-${Date.now()}`,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    setUsersList((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Sync to Supabase in the background
    if (isSupabaseConfigured()) {
      upsertUserInDb(newUser).catch((err) =>
        console.warn('Failed to sync new user to Supabase:', err)
      );
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const modified: User = { ...currentUser, ...updated };
    setCurrentUser(modified);
    setUsersList((prev) => prev.map((u) => (u.id === modified.id ? modified : u)));

    // Sync to Supabase in the background
    if (isSupabaseConfigured()) {
      upsertUserInDb(modified).catch((err) =>
        console.warn('Failed to update user profile in Supabase:', err)
      );
    }
  };

  const switchRole = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      const admin = usersList.find((u) => u.role === 'admin') || INITIAL_USERS[1];
      setCurrentUser(admin);
    } else {
      const normalUser = usersList.find((u) => u.role === 'user') || INITIAL_USERS[0];
      setCurrentUser(normalUser);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
        usersList,
        refreshUsersFromDb
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
