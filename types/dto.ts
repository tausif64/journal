// types/dto.ts

/**
 * Generic pagination DTO
 */
import { Session, User } from "@/lib/generated/prisma/client";

/**
 * ===== User DTOs =====
 */
export enum Role {
  AUTHOR = "AUTHOR",
  REVIEWER = "REVIEWER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  OTHER = "OTHER",
}

export enum ArticleStatus {
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  REVISION = "REVISION",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PUBLISHED = "PUBLISHED",
}


export type UserUpdateProfileDTO = {
  name?: string | null;
  image?: string | null;
  gender?: Gender | null;
  phone?: string | null;
  address?: string | null;
};

export type UserLookupDTO = {
  id: string;
  name: string | null;
  email: string;
};

export type ApiSessionResponse = {
  session: Session;
  user: User;
};

/**
 * Admin-only actions
 */
/**
 * ===== Admin User DTOs =====
 */

export type AdminUserListItemDTO = {
  id: string;
  name: string | null;
  email: string;
  role: Role.ADMIN;
  gender: Gender | null;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  banned: boolean;
};

export type AdminUserDetailDTO = {
  id: string;
  name: string | null;
  email: string;
  role: Role.ADMIN;
  gender: Gender | null;
  phone: string;
  image: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;

  articles: ArticleListItemDTO[];
  reviews: ReviewListItemDTO[];

  banned: boolean;
  banInfo?: {
    reason: string | null;
    expiresAt: Date | null;
  } | null;
};

export type AdminBanUserResponseDTO = {
  userId: string;
  banned: boolean;
  reason?: string | null;
  expiresAt?: Date | null;
};

export type AdminChangeRoleResponseDTO = {
  userId: string;
  role: Role;
};

/**
 * ===== Article DTOs =====
 */
export type ArticleCreateDTO = {
  title: string;
  abstract: string;
  fileUrl: string;
  keywords?: string | null;
  coverImage?: string | null;

  authors: {
    email: string; // search by registered email
    fullName?: string; // optional: just for display on client
    designation?: string; // optional
    affiliation?: string; // college / university / address
    phone?: string; // optional
  }[];
};

export type ArticleListItemDTO = {
  id: string;
  slug?: string;
  title: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  fileUrl: string;
  coverImage?: string | null;
  keywords?: string | null;
  authors: {
    authorOrder: number;
    isCorresponding: boolean;
    author: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];
  editor?: {
    id: string;
    name: string | null;
    email?: string;
  } | null;
  payment?: PaymentDTO | null;
  issue?: {
    id: string;
    issueNumber: number;
    volumeId?: string;
  } | null;
};

export type ArticleDetailDTO = {
  id: string;
  slug?: string;
  title: string;
  abstract: string;
  fileUrl: string;
  keywords: string | null;
  coverImage: string | null;
  status: string;

  authors: {
    id?: string;
    authorOrder: number;
    isCorresponding: boolean;
    author: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];

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
 * ===== Admin Dashboard DTOs =====
 */
export type AdminDashboardStatsDTO = {
  totalUsers: number;
  totalArticles: number;
  totalVolumes: number;
  totalIssues: number;

  articlesByStatus: {
    SUBMITTED: number;
    UNDER_REVIEW: number;
    REVISION: number;
    ACCEPTED: number;
    REJECTED: number;
    PUBLISHED: number;
  };
};


export type AdminArticleListItemDTO = {
  id: string;
  title: string;
  status: ArticleStatus;
  createdAt: Date | string;

  editor?: {
    id: string;
    name: string | null;
  } | null;

  issue?: {
    id: string;
    issueNumber: number;
    volumeNumber: number;
  } | null;
};




/**
 * ===== API Response DTOs =====
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
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: PaginationMetaDTO;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
