// app/server/services/user.service.ts
import { NotFoundError, PermissionError } from "@/lib/errors";
import type { Prisma } from "../../../lib/generated/prisma/client";
import { userDAL } from "../dal/user.dal";

/**
 * User service
 *
 * - Auth (signup/signin) is handled by better-auth.
 * - These methods provide safe profile updates and admin actions.
 */

export const userService = {
  getProfile: async (userId: string) => {
    const user = await userDAL.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  updateProfile: async (
    userId: string,
    payload: { name?: string | null; image?: string | null }
  ) => {
    // Basic server-side validation can be added here (e.g., name length).
    return userDAL.updateProfile(userId, {
      name: payload.name ?? undefined,
      image: payload.image ?? undefined,
    });
  },

  markEmailVerified: async (userId: string) => {
    return userDAL.setEmailVerified(userId, true);
  },

  // Admin-only: changes should be guarded by controller/service caller
  banUser: async (
    actor: { id: string; role: string },
    userId: string,
    opts?: { reason?: string; expiresAt?: Date | null }
  ) => {
    if (actor.role !== "ADMIN")
      throw new PermissionError("Only admins can ban users");
    return userDAL.banUser(userId, {
      reason: opts?.reason,
      expiresAt: opts?.expiresAt ?? null,
    });
  },

  unbanUser: async (actor: { id: string; role: string }, userId: string) => {
    if (actor.role !== "ADMIN")
      throw new PermissionError("Only admins can unban users");
    return userDAL.unbanUser(userId);
  },

  setRole: async (
    actor: { id: string; role: string },
    userId: string,
    role: Prisma.UserUpdateInput["role"]
  ) => {
    if (actor.role !== "ADMIN")
      throw new PermissionError("Only admins can change roles");
    return userDAL.setRole(userId, role);
  },

  listUsers: async (
    actor: { role: string },
    opts?: { take?: number; skip?: number }
  ) => {
    if (actor.role !== "ADMIN")
      throw new PermissionError("Only admins can list users");
    return userDAL.list(opts);
  },
};
