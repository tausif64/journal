import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: "https://macroj.tausifansari.com/",
  plugins: [inferAdditionalFields<typeof auth>()],
});
