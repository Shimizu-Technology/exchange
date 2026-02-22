"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Search, Shield, Ban, Star } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function AdminUsersPage() {
  const usersData = useQuery(api.admin.listUsers);
  const users: any[] = usersData ?? [];
  const updateUser = useMutation(api.admin.updateUser);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u: any) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBan = async (userId: Id<"users">, isBanned: boolean) => {
    await updateUser({ userId, isBanned: !isBanned });
  };

  const handleTogglePremium = async (userId: Id<"users">, isPremium: boolean) => {
    await updateUser({ userId, isPremium: !isPremium });
  };

  const handleToggleRole = async (userId: Id<"users">, role: string) => {
    await updateUser({ userId, role: role === "admin" ? "user" : "admin" });
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ocean mb-6">Users</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
        />
      </div>

      <div className="bg-white rounded-xl border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/5 bg-cream/50">
                <th className="text-left px-4 py-3 font-medium text-muted">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/30">
                  <td className="px-4 py-3 font-medium text-charcoal">{user.name}</td>
                  <td className="px-4 py-3 text-muted">{user.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-ocean/10 text-ocean" : "bg-charcoal/5 text-muted"}`}>
                      {user.role === "admin" && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {user.isBanned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                          <Ban className="w-3 h-3" /> Banned
                        </span>
                      )}
                      {user.isPremium && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <Star className="w-3 h-3" /> Premium
                        </span>
                      )}
                      {!user.isBanned && !user.isPremium && (
                        <span className="text-muted text-xs">Active</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(user._id, user.role)}
                        className="px-3 py-1 text-xs rounded-lg border border-ocean/20 text-ocean hover:bg-ocean/5 transition-colors"
                      >
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleTogglePremium(user._id, user.isPremium)}
                        className="px-3 py-1 text-xs rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        {user.isPremium ? "Remove Premium" : "Set Premium"}
                      </button>
                      <button
                        onClick={() => handleToggleBan(user._id, user.isBanned)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-colors ${user.isBanned ? "border-sage/30 text-sage hover:bg-sage/5" : "border-red-200 text-red-600 hover:bg-red-50"}`}
                      >
                        {user.isBanned ? "Unban" : "Ban"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted">No users found.</div>
        )}
      </div>
    </div>
  );
}
