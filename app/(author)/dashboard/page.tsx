"use client";
import { useSession } from "@/hooks/use-user";
import UserProfile from "./_components/UserProfile";
import { UserProfileSkeleton } from "@/components/skeleton/UserProfileSkeleton";
import UserArticles from "./_components/UserArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  const { session, isLoading } = useSession();
  return (
    <div className="min-h-screen max-w-6xl mx-auto py-4">
      {isLoading ? (
        <UserProfileSkeleton />
      ) : (
        session && <UserProfile session={session} />
      )}

      <Card className="my-6 border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Share Your Publication Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Submit a testimonial about your publication journey. It will be
            reviewed by admin before appearing on the website.
          </p>
          <Button asChild>
            <Link href="/dashboard/testimonials">Submit Review</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Articles Section */}
      <UserArticles />
    </div>
  );
};

export default Page;
