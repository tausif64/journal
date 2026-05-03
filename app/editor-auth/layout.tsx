import { ReactNode } from "react";
import BackButton from "@/components/back-button";

export default function EditorAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <div className="absolute left-5 top-5">
        <BackButton location="/" />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6 px-4">{children}</div>
    </div>
  );
}
