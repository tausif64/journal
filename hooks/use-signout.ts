"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

export  function useSignOut(){
    const router = useRouter();
    const setSession = useUserStore((state) => state.setSession);

    const handleSignOut = async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setSession(null);
            router.refresh();
            router.push("/");
            toast.success("Signed out successfully");
          },
          onError: () => {
            toast.error("Failed to sign out");
          },
        },
      });
    };

    return handleSignOut;
}
