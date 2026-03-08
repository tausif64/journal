import Link from "next/link";
import { Metadata } from "next";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Academic Journals - MACROJ Research Journal",
  description:
    "Discover current and past issues of MACROJ Research Journal with peer-reviewed publications.",
};

export default async function JournalsPage() {
  const currentIssue =
    (await prisma.issue.findFirst({
      where: { status: "PUBLISHED" },
      include: {
        volume: {
          include: {
            journal: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })) ??
    (await prisma.issue.findFirst({
      include: {
        volume: {
          include: {
            journal: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }));

  const recentIssues = await prisma.issue.findMany({
    include: {
      volume: {
        include: {
          journal: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 9,
  });

  return (
    <>
      <BreadcrumbBanner
        title="Journals"
        subtitle="Explore currently published and recent journal issues from MACROJ."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />

      {/* Previous static sections are intentionally commented out as requested.
      - Header Section
      - Browse by Discipline
      - Static Recent Publications
      - Editorial Policy Section
      */}

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-center text-3xl font-semibold">Current Journal</h2>
        {currentIssue ? (
          <Card className="mx-auto max-w-4xl rounded-none border-slate-200">
            <CardContent className="space-y-3 p-6 text-center">
              <BookOpen className="mx-auto h-10 w-10" />
              <h3 className="text-xl font-semibold">
                {currentIssue.volume.journal.name} - Volume{" "}
                {currentIssue.volume.volumeNumber}, Issue {currentIssue.issueNumber}
              </h3>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-sky-600" />
                <span>
                  {currentIssue.volume.year} • {currentIssue.status}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Badge variant="outline">ISSN: {currentIssue.volume.journal.issn}</Badge>
                <Badge variant="outline">
                  Published: {new Date(currentIssue.createdAt).toLocaleDateString("en-IN")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mx-auto max-w-4xl rounded-none">
            <CardContent className="p-6 text-center text-muted-foreground">
              No journal issues available yet.
            </CardContent>
          </Card>
        )}
      </section>

      <Separator className="my-8" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-center text-3xl font-semibold">Recent Journals</h2>
        {recentIssues.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentIssues.map((issue) => (
              <Card key={issue.id} className="rounded-none hover:shadow-md">
                <CardContent className="space-y-3 p-5">
                  <FileText className="h-6 w-6 text-amber-600" />
                  <h3 className="font-semibold text-slate-800">
                    {issue.volume.journal.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    <strong>Volume:</strong> {issue.volume.volumeNumber} (
                    {issue.volume.year})
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Issue:</strong> {issue.issueNumber}
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Status:</strong> {issue.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(issue.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No recent journal issues found.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/submit">Submit Paper</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
