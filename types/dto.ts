// types/dto.ts

/**
 * Generic pagination DTO
 */
export type PaginationQueryDTO = {
  limit?: number;
  page?: number;
};

export type PaginationMetaDTO = {
  limit: number;
  page: number;
  returned: number;
};

/**
 * ===== User DTOs =====
 */

export type UserProfileDTO = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  banned: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserUpdateProfileDTO = {
  name?: string | null;
  image?: string | null;
};

/**
 * Admin-only actions
 */
export type AdminBanUserDTO = {
  userId: string;
  reason?: string | null;
  expiresAt?: Date | null;
};

export type AdminChangeRoleDTO = {
  userId: string;
  role: string;
};

/**
 * ===== Article DTOs =====
 */

export type ArticleCreateDTO = {
  title: string;
  abstract: string;
  fileUrl: string; // pdf url
  keywords?: string | null;
  coverImage?: string | null;
};

export type ArticleListItemDTO = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  fileUrl: string;
  coverImage: string | null;
};

export type ArticleDetailDTO = {
  id: string;
  title: string;
  abstract: string;
  fileUrl: string;
  keywords: string | null;
  coverImage: string | null;
  status: string;

  author: {
    id: string;
    name: string | null;
    email: string;
  };

  editor?: {
    id: string;
    name: string | null;
    email: string;
  } | null;

  reviews: ReviewListItemDTO[];
  payment?: PaymentDTO | null;
  createdAt: Date;
  updatedAt: Date;

  issue?: {
    id: string;
    issueNumber: number;
    volumeId: string;
  } | null;
};

/**
 * ===== Review DTOs =====
 */

export type ReviewCreateDTO = {
  articleId: string;
  comments: string;
  recommendation: string;
};

export type ReviewListItemDTO = {
  id: string;
  comments: string;
  recommendation: string;
  reviewer: {
    id: string;
    name: string | null;
  };
  createdAt: Date;
};

/**
 * ===== Payment DTOs =====
 */

export type PaymentDTO = {
  id: string;
  articleId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentCreateDTO = {
  articleId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
};

/**
 * ===== Admin DTOs =====
 */

export type JournalCreateDTO = {
  name: string;
  issn: string;
};

export type VolumeCreateDTO = {
  volumeNumber: number;
  year: number;
  journalId: string;
  coverImage?: string | null;
};

export type IssueCreateDTO = {
  issueNumber: number;
  volumeId: string;
  publicationDate?: Date | null;
  status?: "DRAFT" | "PUBLISHED";
  coverImage?: string | null;
};

/**
 * ===== Controller Response DTOs =====
 */

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: PaginationMetaDTO;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
};

/**
 * Utility union for controller returns
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
