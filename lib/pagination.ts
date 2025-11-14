// utils/pagination.ts
export type PaginationParams = {
  take?: number; // how many
  skip?: number; // offset
};

export const normalizePagination = ({
  take = 20,
  skip = 0,
}: PaginationParams = {}) => {
  const safeTake = Math.max(1, Math.min(100, take));
  const safeSkip = Math.max(0, skip);
  return { take: safeTake, skip: safeSkip };
};
