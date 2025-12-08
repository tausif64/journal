"use client";
import { useSession } from "@/hooks/use-user";
import UserProfile from "./_components/UserProfile";
import { UserProfileSkeleton } from "@/components/skeleton/UserProfileSkeleton";
import UserArticles from "./_components/UserArticles";

const Page = () => {
  const { session, isLoading } = useSession();
  return (
    <div className="min-h-screen max-w-6xl mx-auto py-4">
      {isLoading ? (
        <UserProfileSkeleton />
      ) : (
        session && <UserProfile session={session} />
      )}

      {/* Articles Section */}
      <UserArticles />
    </div>
  );
};

export default Page;
