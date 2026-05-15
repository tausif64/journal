import { Metadata } from "next";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Banner from "@/components/banner";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Journal Issues - MACROJ Research Journal",
  description: "Explore issues of the journal volume.",
};

export default async function IssuesPage({
  params,
}: {
  params: Promise<{ journalId: string; volumeId: string }>;
}) {
  const { journalId, volumeId } = await params;

  const volume = await prisma.volume.findUnique({
    where: { id: volumeId },
    include: {
      journal: true,
    },
  });

  if (!volume || volume.journalId !== journalId) {
    notFound();
  }

  const issues = await prisma.issue.findMany({
    where: {
      volumeId,
      status: "PUBLISHED",
    },
    include: {
      volume: {
        include: {
          journal: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <BreadcrumbBanner
        title={`${volume.journal.name} - Volume ${volume.volumeNumber} Issues`}
        subtitle="Explore the issues of this volume."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-center text-3xl font-semibold">
          Issues
        </h2>
        {issues.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/publications/journals/${journalId}/volumes/${volumeId}/issues/${issue.id}/articles`}
              >
                <Card className="rounded-none hover:shadow-md">
               <CardContent className="space-y-3 p-5">
                 <FileText className="h-6 w-6 text-amber-600" />
                 <h3 className="font-semibold text-slate-800">
                   Issue {issue.issueNumber}
                 </h3>
                 <p className="text-sm text-slate-600">
                   <strong>Year:</strong> {issue.volume.year}
                 </p>
                 <p className="text-sm text-slate-600">
                   <strong>Volume:</strong> {issue.volume.volumeNumber}
                 </p>
                 <p className="text-sm text-slate-600">
                   <strong>Journal:</strong> {issue.volume.journal.name}
                 </p>
                 <p className="text-xs text-muted-foreground">
                   {new Date(issue.createdAt).toLocaleDateString("en-IN")}
                 </p>
               </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No published issues found for this volume.
          </p>
        )}
      </section>

      <Banner />
    </>
  );
}
