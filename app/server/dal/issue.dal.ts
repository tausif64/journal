// server/dal/issue.dal.ts
import { prisma } from "@/lib/prisma";

export const issueDAL = {
  create: async (data: {
    issueNumber: number;
    volumeId: string;
    publicationDate?: Date | null;
    status?: "DRAFT" | "PUBLISHED";
    coverImage?: string | null;
  }) => {
    return prisma.issue.create({ data });
  },

  findById: async (id: string) => {
    return prisma.issue.findUnique({
      where: { id },
      include: { articles: true, volume: true },
    });
  },

  listByVolume: async (
    volumeId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);
    return prisma.issue.findMany({
      where: { volumeId },
      include: { articles: true },
      orderBy: { issueNumber: "asc" },
      take,
      skip,
    });
  },

  update: async (
    id: string,
    data: Partial<{
      publicationDate?: Date | null;
      status?: "DRAFT" | "PUBLISHED";
      coverImage?: string | null;
    }>
  ) => {
    return prisma.issue.update({ where: { id }, data });
  },
};
