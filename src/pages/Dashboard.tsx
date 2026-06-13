// src/pages/Dashboard.tsx
// Personne 3 — feature/dashboard

import { useState } from 'react';
import { reservations, dashboardStats, cars } from '../data/mockData';
import { getUsers, deleteUserById, updateUserRole, updateUserPassword } from '../utils/auth';
import type { Reservation } from '../types';

// Couleurs selon le statut de la réservation
const statusStyle: Record<string, string> = {
  en_cours:  'bg-blue-100 text-blue-800',
  confirmée: 'bg-green-100 text-green-800',
  terminée:  'bg-gray-100 text-gray-600',
  annulée:   'bg-red-100 text-red-700',
};

const statusLabel: Record<string, string> = {
  en_cours:  '🔵 En cours',
  confirmée: '✅ Confirmée',
  terminée:  '⬛ Terminée',
  annulée:   '❌ Annulée',
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'cars' | 'users'>('overview');
  const [users, setUsers] = useState(() => getUsers());
  const [filterStatus, setFilterStatus] = useState<string>('tous');

  // Filtrer les réservations par statut
  const filteredReservations: Reservation[] =
    filterStatus === 'tous'
      ? reservations
      : reservations.filter((r) => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header du dashboard */}
      <div className="bg-blue-900 text-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black">Tableau de bord</h1>
            <p className="text-blue-300 text-sm mt-1">Bienvenue, Admin CarRent 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-blue-900 font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-blue-300">Carrent@admin.sn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { key: 'overview', label: '📊 Vue générale' },
            { key: 'reservations', label: '📋 Réservations' },
            { key: 'cars', label: '🚗 Véhicules' },
            { key: 'users', label: '👥 Utilisateurs' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-blue-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ===== ONGLET VUE GÉNÉRALE ===== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Cartes statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total réservations',
                  value: dashboardStats.totalReservations,
                  icon: '📋',
                  color: 'bg-blue-50 border-blue-200',
                  textColor: 'text-blue-900',
                },
                {
                  label: 'En cours',
                  value: dashboardStats.activeReservations,
                  icon: '🔵',
                  color: 'bg-amber-50 border-amber-200',
                  textColor: 'text-amber-700',
                },
                {
                  label: 'Voitures disponibles',
                  value: dashboardStats.availableCars,
                  icon: '🚗',
                  color: 'bg-green-50 border-green-200',
                  textColor: 'text-green-700',
                },
                {
                  label: 'Revenus (FCFA)',
                  value: dashboardStats.totalRevenue.toLocaleString('fr-FR'),
                  icon: '💰',
                  color: 'bg-purple-50 border-purple-200',
                  textColor: 'text-purple-700',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`${stat.color} border rounded-2xl p-5`}
                >
                  <p className="text-2xl mb-2">{stat.icon}</p>
                  <p className={`text-2xl font-black ${stat.textColor}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Réservations récentes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-blue-900 text-lg">Réservations récentes</h2>
                <button
                  onClick={() => setActiveTab('reservations')}
                  className="text-sm text-amber-500 hover:underline font-semibold"
                >
                  Voir tout →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">Client</th>
                      <th className="px-6 py-3 text-left">Véhicule</th>
                      <th className="px-6 py-3 text-left">Dates</th>
                      <th className="px-6 py-3 text-left">Montant</th>
                      <th className="px-6 py-3 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reservations.slice(0, 3).map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{r.clientName}</p>
                          <p className="text-gray-400 text-xs">{r.clientEmail}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {r.carBrand} {r.carModel}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {r.startDate} → {r.endDate}
                        </td>
                        <td className="px-6 py-4 font-semibold text-blue-900">
                          {r.totalPrice.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>
                            {statusLabel[r.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disponibilité voitures */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-blue-900 text-lg mb-4">État de la flotte</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round((cars.filter((c) => c.available).length / cars.length) * 100)}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {cars.filter((c) => c.available).length}/{cars.length} disponibles
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
                {['economique', 'confort', 'suv', 'luxe'].map((cat) => {
                  const count = cars.filter((c) => c.category === cat).length;
                  const available = cars.filter((c) => c.category === cat && c.available).length;
                  return (
                    <div key={cat} className="bg-gray-50 rounded-xl p-3">
                      <p className="capitalize font-semibold text-gray-700">{cat}</p>
                      <p className="text-green-600 font-bold">{available} dispo</p>
                      <p className="text-gray-400 text-xs">sur {count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===== ONGLET UTILISATEURS ===== */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Utilisateurs inscrits</h2>
            <p className="text-sm text-gray-500 mb-6">Total : {users.length}</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-3">Nom</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Téléphone</th>
                    <th className="py-3">Rôle</th>
                    <th className="py-3">Créé le</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-semibold text-gray-900">{u.fullName}</td>
                      <td className="py-3 text-sm text-gray-600">{u.email}</td>
                      <td className="py-3 text-sm text-gray-600">{u.phone}</td>
                      <td className="py-3 text-sm text-gray-600 capitalize">{u.role}</td>
                      <td className="py-3 text-sm text-gray-600">{new Date(u.createdAt).toLocaleString('fr-FR')}</td>
                      <td className="py-3 text-sm text-gray-600">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const confirmed = confirm(`Supprimer ${u.fullName} ?`);
                              if (!confirmed) return;
                              const res = deleteUserById(u.id);
                              if (res.success) setUsers(getUsers());
                              else alert(res.message || 'Erreur');
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Supprimer
                          </button>

                          <button
                            onClick={() => {
                              const newRole = u.role === 'admin' ? 'client' : 'admin';
                              const confirmed = confirm(`Changer le rôle de ${u.fullName} en ${newRole} ?`);
                              if (!confirmed) return;
                              const res = updateUserRole(u.id, newRole as 'admin' | 'client');
                              if (res.success) setUsers(getUsers());
                              else alert(res.message || 'Erreur');
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                          >
                            Basculer rôle
                          </button>

                          <button
                            onClick={() => {
                              const pwd = prompt(`Nouveau mot de passe pour ${u.fullName} :`);
                              if (!pwd) return;
                              const confirmPwd = prompt('Confirmer le nouveau mot de passe :');
                              if (pwd !== confirmPwd) {
                                alert('Les mots de passe ne correspondent pas.');
                                return;
                              }
                              const res = updateUserPassword(u.id, pwd);
                              if (res.success) {
                                alert('Mot de passe mis à jour.');
                                setUsers(getUsers());
                              } else {
                                alert(res.message || 'Erreur');
                              }
                            }}
                            className="text-green-600 hover:text-green-800 text-sm font-semibold"
                          >
                            Changer mot de passe
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== ONGLET RÉSERVATIONS ===== */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {['tous', 'en_cours', 'confirmée', 'terminée', 'annulée'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                    filterStatus === s
                      ? 'bg-blue-900 text-white shadow'
                      : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  {s === 'tous' ? 'Toutes' : statusLabel[s]}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">#</th>
                      <th className="px-6 py-3 text-left">Client</th>
                      <th className="px-6 py-3 text-left">Véhicule</th>
                      <th className="px-6 py-3 text-left">Lieu</th>
                      <th className="px-6 py-3 text-left">Période</th>
                      <th className="px-6 py-3 text-left">Montant</th>
                      <th className="px-6 py-3 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredReservations.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-400 font-mono">#{r.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{r.clientName}</p>
                          <p className="text-gray-400 text-xs">{r.clientEmail}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{r.carBrand} {r.carModel}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{r.pickupLocation}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {r.startDate}<br />{r.endDate}
                        </td>
                        <td className="px-6 py-4 font-bold text-blue-900">
                          {r.totalPrice.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>
                            {statusLabel[r.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredReservations.length === 0 && (
                  <p className="text-center text-gray-400 py-12">Aucune réservation pour ce filtre.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== ONGLET VÉHICULES ===== */}
        {activeTab === 'cars' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-blue-900 text-lg">Gestion de la flotte</h2>
              <span className="text-sm text-gray-500">{cars.length} véhicules</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Véhicule</th>
                    <th className="px-6 py-3 text-left">Catégorie</th>
                    <th className="px-6 py-3 text-left">Transmission</th>
                    <th className="px-6 py-3 text-left">Carburant</th>
                    <th className="px-6 py-3 text-left">Prix/jour</th>
                    <th className="px-6 py-3 text-left">Note</th>
                    <th className="px-6 py-3 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{car.brand} {car.model}</p>
                        <p className="text-gray-400 text-xs">{car.year} • {car.seats} places</p>
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-600">{car.category}</td>
                      <td className="px-6 py-4 capitalize text-gray-600">{car.transmission}</td>
                      <td className="px-6 py-4 capitalize text-gray-600">{car.fuel}</td>
                      <td className="px-6 py-4 font-bold text-blue-900">
                        {car.price.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-yellow-500">★</span> {car.rating}
                        <span className="text-gray-400 text-xs ml-1">({car.reviews})</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            car.available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {car.available ? '✅ Disponible' : '❌ Indisponible'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
