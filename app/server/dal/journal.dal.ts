// server/dal/journal.dal.ts
import { prisma } from "@/lib/prisma";

export const journalDAL = {
  create: async (data: { name: string; issn: string }) => {
    return prisma.journal.create({ data });
  },

  findById: async (id: string) => {
    return prisma.journal.findUnique({
      where: { id },
      include: { volumes: true },
    });
  },

  findByIssn: async (issn: string) => {
    return prisma.journal.findUnique({ where: { issn } });
  },

  list: async (opts?: { take?: number; skip?: number }) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);
    return prisma.journal.findMany({ take, skip, orderBy: { name: "asc" } });
  },

  update: async (id: string, data: { name?: string; issn?: string }) => {
    return prisma.journal.update({ where: { id }, data });
  },
};
