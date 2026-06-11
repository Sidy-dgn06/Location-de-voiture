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
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'client';
}

const USERS_KEY = 'carrent_users';
const SESSION_KEY = 'carrent_session';

// Compte admin par défaut pour faciliter les tests et la gestion initiale
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

export function getUsers(): StoredUser[] {
  const data = localStorage.getItem(USERS_KEY);
  const users: StoredUser[] = data ? JSON.parse(data) : [];
  const updatedUsers = ensureDefaultAdmin(users);
  saveUsers(updatedUsers);
  return updatedUsers;
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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

export function register(
  fullName: string,
  email: string,
  phone: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { success: false, message: 'Un compte avec cet email existe déjà.' };
  }
  const newUser: StoredUser = {
    id: Date.now().toString(),
    fullName,
    email,
    phone,
    password,
    role: 'client',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  const session: SessionUser = {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, message: 'Compte créé avec succès !' };
}

export function login(
  email: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  let user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user && normalizedEmail === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
    user = DEFAULT_ADMIN;
  }

  if (!user) {
    return { success: false, message: 'Email ou mot de passe incorrect.' };
  }

  const session: SessionUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, message: 'Connexion réussie !' };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): SessionUser | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? (JSON.parse(data) as SessionUser) : null;
}

export function resetPassword(
  email: string,
  newPassword: string
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
