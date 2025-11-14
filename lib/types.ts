
import type {
  Article,
  User,
  Review,
  Payment,
  Volume,
  Issue,
  Journal,
} from "./generated/prisma/client";

export interface Member {
  id: number;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}


/**
 * DTOs (derived types) — these extend the raw Prisma model types with
 * included relations where appropriate.
 *
 * Keep these small and expand as needed for your API responses.
 */

export type UserPublic = Pick<User, "id" | "name" | "email" | "image" | "role" | "createdAt">;

export type ArticleDTO = Article & {
  author?: UserPublic | null;
  editor?: Pick<User, "id" | "name" | "email"> | null;
  reviews?: Review[];
  payment?: Payment | null;
  issue?: Issue | null;
};

export type ReviewDTO = Review & {
  reviewer?: Pick<User, "id" | "name">;
};

export type PaymentDTO = Payment;

export type VolumeDTO = Volume & {
  journal?: Journal;
  issues?: Issue[];
};
