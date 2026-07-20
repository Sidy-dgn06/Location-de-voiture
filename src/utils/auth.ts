import { fetchJson } from './api';

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'client';
  createdAt: string;
}

export interface SessionUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'client';
}

const USERS_KEY = 'carrent_users';
const SESSION_KEY = 'carrent_session';
const TOKEN_KEY = 'carrent_token';

interface AuthResponse {
  access_token: string;
  user: SessionUser;
}

export function getSession(): SessionUser | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? (JSON.parse(data) as SessionUser) : null;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const data = await fetchJson<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
    localStorage.setItem(TOKEN_KEY, data.access_token);
    return { success: true, message: 'Connexion réussie !' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Email ou mot de passe incorrect.' };
  }
}

export async function register(
  fullName: string,
  email: string,
  phone: string,
  password: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await fetchJson<SessionUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, phone, password }),
    });

    const loginResult = await login(email, password);
    if (!loginResult.success) {
      return { success: false, message: 'Inscription réussie, mais impossible de se connecter automatiquement.' };
    }

    return { success: true, message: 'Compte créé avec succès !' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Impossible de créer un compte.' };
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function resetPassword(
  email: string,
  newPassword: string,
): { success: boolean; message: string } {
  const users = getUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (index === -1) {
    return { success: false, message: 'Aucun compte trouvé avec cet email.' };
  }
  users[index].password = newPassword;
  saveUsers(users);
  return { success: true, message: 'Mot de passe mis à jour avec succès !' };
}

// Keep local user storage for reset-password support and admin fallback
function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUsers(): StoredUser[] {
  const data = localStorage.getItem(USERS_KEY);
  const users: StoredUser[] = data ? JSON.parse(data) : [];
  const updatedUsers = ensureDefaultAdmin(users);
  saveUsers(updatedUsers);
  return updatedUsers;
}

export function deleteUserById(id: string): { success: boolean; message?: string } {
  if (id === DEFAULT_ADMIN.id) {
    return { success: false, message: "Impossible de supprimer l'administrateur par défaut." };
  }
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
  return { success: true };
}

export function updateUserRole(id: string, role: 'admin' | 'client'):
  { success: boolean; message?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return { success: false, message: 'Utilisateur introuvable.' };
  users[idx].role = role;
  saveUsers(users);
  return { success: true };
}

export function updateUserPassword(id: string, newPassword: string): { success: boolean; message?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return { success: false, message: 'Utilisateur introuvable.' };
  users[idx].password = newPassword;
  saveUsers(users);
  return { success: true };
}

const DEFAULT_ADMIN: StoredUser = {
  id: 'admin-001',
  fullName: 'Admin CarRent',
  email: 'Carrent@admin.sn',
  password: 'AZERTY1234',
  phone: '+221 77 801 49 36',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const DEFAULT_ADMIN_EMAIL = DEFAULT_ADMIN.email.toLowerCase();
const DEFAULT_ADMIN_PASSWORD = DEFAULT_ADMIN.password;

function ensureDefaultAdmin(users: StoredUser[]): StoredUser[] {
  const admin = users.find((u) => u.role === 'admin');
  if (!admin) {
    users.push(DEFAULT_ADMIN);
  } else if (
    admin.id === DEFAULT_ADMIN.id &&
    admin.email.toLowerCase() === DEFAULT_ADMIN_EMAIL &&
    admin.password === DEFAULT_ADMIN_PASSWORD
  ) {
    Object.assign(admin, DEFAULT_ADMIN);
  }
  return users;
}
