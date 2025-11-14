// server/dal/user.dal.ts
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Basic, intention-revealing DAL for User.
 *
 * NOTE:
 * - User creation (signup via email/password or OAuth) is handled by your auth
 *   layer (better-auth). Do NOT create users here during normal signup flows.
 * - This DAL focuses on safe read/update operations that other services/controllers
 *   will call after auth has already created the account.
 */

export type UserSelect = Prisma.UserSelect;

export const userDAL = {
  /**
   * Find a user by id (returns selected fields by default).
   */
  findById: async (id: string, opts?: { select?: UserSelect }) => {
    return prisma.user.findUnique({
      where: { id },
      select: opts?.select ?? {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        banned: true,
        banReason: true,
        banExpires: true,
      },
    });
  },

  /**
   * Find a user by email. Useful for admin lookups or linking flows.
   */
  findByEmail: async (email: string, opts?: { select?: UserSelect }) => {
    return prisma.user.findUnique({
      where: { email },
      select: opts?.select ?? {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
      },
    });
  },

  /**
   * Update only profile-related fields. This is the function your "Edit Profile" UI
   * should call (name, image, maybe display preferences).
   *
   * It intentionally does NOT allow changing role, emailVerified, banned, etc.
   */
  updateProfile: async (
    id: string,
    data: Partial<{
      name: string | null;
      image: string | null;
      // add other safe-to-change profile fields here
    }>
  ) => {
    // Only update allowed fields — keep DAL small and predictable.
    const allowed: Record<string, unknown> = {};
    if (data.name !== undefined) allowed["name"] = data.name;
    if (data.image !== undefined) allowed["image"] = data.image;

    return prisma.user.update({
      where: { id },
      data: allowed,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Mark email as verified (used after email confirmation flows).
   * Keep this separate from profile updates to make intent explicit.
   */
  setEmailVerified: async (id: string, verified = true) => {
    return prisma.user.update({
      where: { id },
      data: { emailVerified: verified },
      select: { id: true, emailVerified: true },
    });
  },

  /**
   * Admin-only actions: ban/unban a user or set ban metadata.
   * Service/controller should enforce the caller is an ADMIN.
   */
  banUser: async (
    id: string,
    opts?: { reason?: string | null; expiresAt?: Date | null }
  ) => {
    return prisma.user.update({
      where: { id },
      data: {
        banned: true,
        banReason: opts?.reason ?? null,
        banExpires: opts?.expiresAt ?? null,
      },
      select: { id: true, banned: true, banReason: true, banExpires: true },
    });
  },

  unbanUser: async (id: string) => {
    return prisma.user.update({
      where: { id },
      data: { banned: false, banReason: null, banExpires: null },
      select: { id: true, banned: true },
    });
  },

  /**
   * Admin: change role (EDITOR, REVIEWER, ADMIN, etc).
   * Service/controller MUST check permissions before calling this.
   */
  setRole: async (id: string, role: Prisma.UserUpdateInput["role"]) => {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true },
    });
  },

  /**
   * List users — useful for admin UI. Keep limited fields by default.
   */
  list: async (opts?: { take?: number; skip?: number }) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);

    return prisma.user.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        createdAt: true,
      },
    });
  },
};
