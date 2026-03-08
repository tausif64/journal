// app/server/services/admin.service.ts
import { journalDAL } from "../dal/journal.dal";
import { volumeDAL } from "../dal/volume.dal";
import { issueDAL } from "../dal/issue.dal";
import { userDAL } from "../dal/user.dal";
import { PermissionError } from "@/lib/errors";

/**
 * Admin service — higher-level actions for admin users.
 * Controllers should verify actor.role === 'ADMIN' before calling these.
 */

export const adminService = {
  createJournal: async (
    actor: { role: string },
    payload: { name: string; issn: string; status?: "ACTIVE" | "INACTIVE" }
  ) => {
    if (actor.role !== "ADMIN")
      throw new PermissionError("Only admins can create journals");
    return journalDAL.create(payload);
  },

  createVolume: async (
    actor: { role: string },
    payload: {
      volumeNumber: number;
      year: number;
      journalId: string;
      coverImage?: string | null;
    }
  ) => {
    if (actor.role !== "ADMIN")
      throw new PermissionError("Only admins can create volumes");
    return volumeDAL.create(payload);
  },

  createIssue: async (
    actor: { role: string },
    payload: {
      issueNumber: number;
      volumeId: string;
      publicationDate?: Date | null;
      status?: "DRAFT" | "PUBLISHED";
      coverImage?: string | null;
    }
  ) => {
    if (actor.role !== "ADMIN")
      throw new PermissionError("Only admins can create issues");
    return issueDAL.create(payload);
  },

  listUsers: async (
    actor: { role: string },
    opts?: { take?: number; skip?: number }
  ) => {
    if (actor.role !== "ADMIN")
      throw new PermissionError("Only admins can list users");
    return userDAL.list(opts);
  },

  // additional admin helpers can be added here...
};
