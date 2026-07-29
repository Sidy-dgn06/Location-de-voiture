import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { cars, reservations, dashboardStats } from '../data/mockData';
import { getUsers, deleteUserById, updateUserRole, updateUserPassword } from '../utils/auth';
import { API_BASE_URL } from '../utils/api';

const monthlyData = [
  { month: "Jan", revenus: 850000, reservations: 12 },
  { month: "Fév", revenus: 920000, reservations: 15 },
  { month: "Mar", revenus: 780000, reservations: 10 },
  { month: "Avr", revenus: 1100000, reservations: 18 },
  { month: "Mai", revenus: 1350000, reservations: 22 },
  { month: "Jun", revenus: 1265000, reservations: 20 },
];

const deviceData = [
  { name: "Dakar", value: 52.1, color: "#1e3a5f" },
  { name: "Thiès", value: 22.8, color: "#3b7dd8" },
  { name: "Saint-Louis", value: 13.9, color: "#6baed6" },
  { name: "Autres", value: 11.2, color: "#c8dcf0" },
];

// ── Status helpers ─────────────────────────────────────────────────────────
const statusStyle = {
  en_cours:  "bg-blue-100 text-blue-700",
  confirmée: "bg-emerald-100 text-emerald-700",
  terminée:  "bg-gray-100 text-gray-500",
  annulée:   "bg-red-100 text-red-600",
};
const statusLabel = {
  en_cours:  "En cours",
  confirmée: "Confirmée",
  terminée:  "Terminée",
  annulée:   "Annulée",
};

const stats = [
  { label: "Total réservations", value: dashboardStats.totalReservations, change: "+11%", up: true, icon: "📋" },
  { label: "En cours",           value: dashboardStats.activeReservations, change: "+5%", up: true, icon: "🔄" },
  { label: "Voitures dispos",    value: dashboardStats.availableCars, change: "+15%", up: true, icon: "🚗" },
  { label: "Revenus (FCFA)",     value: dashboardStats.totalRevenue.toLocaleString("fr-FR"), change: "+6%", up: true, icon: "💰" },
];

const parsePrometheusMetrics = (text: string) => {
  return text
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .reduce<Record<string, string>>((acc, line) => {
      const index = line.lastIndexOf(' ');
      if (index > 0) {
        const key = line.substring(0, index).trim();
        const value = line.substring(index + 1).trim();
        acc[key] = value;
      }
      return acc;
    }, {});
};

// ── Component ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [metricsData, setMetricsData] = useState<Record<string, string>>({});
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await fetch(`${API_BASE_URL}/metrics`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }
        const text = await response.text();
        setMetricsData(parsePrometheusMetrics(text));
      } catch (error: any) {
        setMetricsError(error?.message || 'Impossible de charger les métriques');
      } finally {
        setMetricsLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const totalHttpRequests = Object.entries(metricsData)
    .filter(([key]) => key.startsWith('http_requests_total'))
    .reduce((sum, [, value]) => sum + Number(value), 0);

  const cpuUserSeconds = Number(metricsData['process_cpu_user_seconds_total'] ?? '0');
  const heapUsedBytes = Number(metricsData['process_resident_memory_bytes'] ?? metricsData['nodejs_heap_used_bytes'] ?? '0');
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("tous");
  const [users, setUsers] = useState(() => getUsers());

  const filtered = filterStatus === "tous"
    ? reservations
    : reservations.filter(r => r.status === filterStatus);

  const tabs = [
    { key: "overview",      label: "Vue générale",  icon: "📊" },
    { key: "reservations",  label: "Réservations",  icon: "📋" },
    { key: "cars",          label: "Véhicules",     icon: "🚗" },
    { key: "users",         label: "Utilisateurs",  icon: "👥" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-slate-100 flex">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 bg-slate-900 text-white min-h-screen py-8 px-4 gap-2 shrink-0">
        <div className="mb-8 px-2">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">CarRent</p>
          <h2 className="text-xl font-black text-white">Admin</h2>
        </div>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === t.key
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
        <div className="mt-auto pt-8 border-t border-slate-800 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center font-bold text-slate-900 text-sm">A</div>
            <div>
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-slate-500">CarRent</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Tableau de bord</p>
            <h1 className="text-xl font-bold text-slate-800">
              {tabs.find(t => t.key === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Aujourd'hui ↓</span>
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center font-bold text-slate-900 text-sm">A</div>
          </div>
        </header>

        {/* Mobile tabs */}
        <div className="lg:hidden flex overflow-x-auto gap-1 px-4 py-3 bg-white border-b border-slate-100">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === t.key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-4 sm:p-6 space-y-6">

          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                {stats.map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                      <span className="text-xl">{s.icon}</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{s.value}</p>
                    <p className={`text-xs mt-1 font-semibold ${s.up ? "text-emerald-500" : "text-red-400"}`}>
                      {s.change} {s.up ? "↑" : "↓"} ce mois
                    </p>
                  </div>
                ))}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Métriques backend</p>
                      <h3 className="text-sm font-semibold text-slate-800">Prometheus</h3>
                    </div>
                    <span className="text-xl">📈</span>
                  </div>
                  {metricsLoading ? (
                    <p className="text-sm text-slate-500">Chargement...</p>
                  ) : metricsError ? (
                    <p className="text-sm text-red-500">{metricsError}</p>
                  ) : (
                    <div className="space-y-3 text-sm text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>Total requêtes</span>
                        <span className="font-semibold">{totalHttpRequests.toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>CPU utilisateur</span>
                        <span className="font-semibold">{cpuUserSeconds.toFixed(2)} s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mémoire résidente</span>
                        <span className="font-semibold">{(heapUsedBytes / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Line chart - Revenus */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Revenus & réservations</p>
                    <h3 className="font-bold text-slate-800">Évolution mensuelle</h3>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded"></span> Cette année</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-slate-300 inline-block rounded border-dashed"></span> An dernier</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", fontSize: 12 }}
                      formatter={(v: any, name: any): any => name === "revenus" ? [`${Number(v).toLocaleString("fr-FR")} FCFA`, "Revenus"] : [v, "Réservations"]}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="revenus" stroke="#3b7dd8" strokeWidth={2.5} dot={{ r: 4, fill: "#3b7dd8" }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="reservations" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 2-col: Bar + Donut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bar chart by category */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Flotte</p>
                  <h3 className="font-bold text-slate-800 mb-4">Véhicules par catégorie</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={["economique","confort","suv","luxe"].map(cat => ({
                      cat: cat.charAt(0).toUpperCase() + cat.slice(1),
                      total: cars.filter(c => c.category === cat).length,
                      dispo: cars.filter(c => c.category === cat && c.available).length,
                    }))} barSize={20} margin={{ left: -20, right: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="cat" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: "none", fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="total" name="Total" fill="#c8dcf0" radius={[4,4,0,0]} />
                      <Bar dataKey="dispo" name="Disponible" fill="#3b7dd8" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Donut - locations */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Répartition</p>
                  <h3 className="font-bold text-slate-800 mb-4">Réservations par ville</h3>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie data={deviceData} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3}>
                          {deviceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2 text-sm">
                      {deviceData.map(d => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }}></span>
                          <span className="text-slate-600 text-xs">{d.name}</span>
                          <span className="ml-auto font-bold text-slate-700 text-xs">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent reservations table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Réservations récentes</h3>
                  <button onClick={() => setActiveTab("reservations")} className="text-xs text-blue-500 hover:underline font-semibold">
                    Voir tout →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs text-slate-400 uppercase">
                        <th className="px-6 py-3 text-left">Client</th>
                        <th className="px-6 py-3 text-left">Véhicule</th>
                        <th className="px-6 py-3 text-left">Dates</th>
                        <th className="px-6 py-3 text-left">Montant</th>
                        <th className="px-6 py-3 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {reservations.slice(0, 4).map(r => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800">{r.clientName}</p>
                            <p className="text-xs text-slate-400">{r.clientEmail}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{r.carBrand} {r.carModel}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{r.startDate} → {r.endDate}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{r.totalPrice.toLocaleString("fr-FR")} FCFA</td>
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
            </>
          )}

          {/* ===== RÉSERVATIONS ===== */}
          {activeTab === "reservations" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["tous", "en_cours", "confirmée", "terminée", "annulée"].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      filterStatus === s
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200"
                    }`}
                  >
                    {s === "tous" ? "Toutes" : statusLabel[s as keyof typeof statusLabel]}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-400 uppercase">
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
                    <tbody className="divide-y divide-slate-50">
                      {filtered.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{r.id}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800">{r.clientName}</p>
                            <p className="text-xs text-slate-400">{r.clientEmail}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{r.carBrand} {r.carModel}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{r.pickupLocation}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{r.startDate}<br />{r.endDate}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{r.totalPrice.toLocaleString("fr-FR")} FCFA</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>
                              {statusLabel[r.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <p className="text-center text-slate-400 py-12 text-sm">Aucune réservation pour ce filtre.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== VÉHICULES ===== */}
          {activeTab === "cars" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Gestion de la flotte</h3>
                <span className="text-xs text-slate-400">{cars.length} véhicules</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-400 uppercase">
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
                  <tbody className="divide-y divide-slate-50">
                    {cars.map(car => (
                      <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{car.brand} {car.model}</p>
                          <p className="text-xs text-slate-400">{car.year} • {car.seats} places</p>
                        </td>
                        <td className="px-6 py-4 capitalize text-slate-600">{car.category}</td>
                        <td className="px-6 py-4 capitalize text-slate-600">{car.transmission}</td>
                        <td className="px-6 py-4 capitalize text-slate-600">{car.fuel}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{car.price.toLocaleString("fr-FR")} FCFA</td>
                        <td className="px-6 py-4">
                          <span className="text-amber-400">★</span> <span className="font-semibold text-slate-700">{car.rating}</span>
                          <span className="text-xs text-slate-400 ml-1">({car.reviews})</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${car.available ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                            {car.available ? "✅ Disponible" : "❌ Indisponible"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== UTILISATEURS ===== */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Utilisateurs inscrits</h3>
                  <p className="text-xs text-slate-400 mt-1">Total : {users.length}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase border-b border-slate-100">
                      <th className="pb-3">Nom</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Téléphone</th>
                      <th className="pb-3">Rôle</th>
                      <th className="pb-3">Créé le</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 font-semibold text-slate-800">{u.fullName}</td>
                        <td className="py-4 text-sm text-slate-500">{u.email}</td>
                        <td className="py-4 text-sm text-slate-500">{u.phone}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                        <td className="py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                const confirmed = confirm(`Supprimer ${u.fullName} ?`);
                                if (!confirmed) return;
                                const res = deleteUserById(u.id);
                                if (res.success) setUsers(getUsers());
                                else alert(res.message || 'Erreur');
                              }}
                              className="text-xs text-red-500 hover:text-red-700 font-semibold"
                            >Supprimer</button>
                            <button
                              onClick={() => {
                                const newRole = u.role === 'admin' ? 'client' : 'admin';
                                const confirmed = confirm(`Changer le rôle de ${u.fullName} en ${newRole} ?`);
                                if (!confirmed) return;
                                const res = updateUserRole(u.id, newRole);
                                if (res.success) setUsers(getUsers());
                                else alert(res.message || 'Erreur');
                              }}
                              className="text-xs text-blue-500 hover:text-blue-700 font-semibold"
                            >Rôle</button>
                            <button
                              onClick={() => {
                                const pwd = prompt(`Nouveau mot de passe pour ${u.fullName} :`);
                                if (!pwd) return;
                                const confirmPwd = prompt('Confirmer le mot de passe :');
                                if (pwd !== confirmPwd) { alert('Mots de passe différents.'); return; }
                                const res = updateUserPassword(u.id, pwd);
                                if (res.success) { alert('Mot de passe mis à jour.'); setUsers(getUsers()); }
                                else alert(res.message || 'Erreur');
                              }}
                              className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
                            >Mot de passe</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}