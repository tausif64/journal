import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

import { prisma } from "./prisma";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // plugins:[
  //   admin(),
  // ]
});

export type Session = {
  user: {
    id: string;
    email: string;
    role: "AUTHOR" | "REVIEWER" | "EDITOR" | "ADMIN";
    name?: string | null;
    image?: string | null;
  };
};

export async function getSessionFromRequest(/* req: Request */): Promise<Session | null> {
  // TODO: Replace this stub with your better-auth session retrieval.
  // Example: use server-side helper from better-auth to get session from cookie or headers.
  return null;
}