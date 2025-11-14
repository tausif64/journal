// server/dal/volume.dal.ts
import { prisma } from "@/lib/prisma";

export const volumeDAL = {
  create: async (data: {
    volumeNumber: number;
    year: number;
    coverImage?: string | null;
    journalId: string;
  }) => {
    return prisma.volume.create({ data });
  },

  findById: async (id: string) => {
    return prisma.volume.findUnique({
      where: { id },
      include: { journal: true, issues: true },
    });
  },

  listByJournal: async (
    journalId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);
    return prisma.volume.findMany({
      where: { journalId },
      include: { issues: true },
      orderBy: { volumeNumber: "desc" },
      take,
      skip,
    });
  },

  update: async (
    id: string,
    data: Partial<{
      volumeNumber?: number;
      year?: number;
      coverImage?: string | null;
    }>
  ) => {
    return prisma.volume.update({ where: { id }, data });
  },
};

