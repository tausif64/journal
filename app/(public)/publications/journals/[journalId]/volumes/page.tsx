import { Metadata } from "next";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Banner from "@/components/banner";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Journal Volumes - MACROJ Research Journal",
  description: "Explore volumes of the journal.",
};

export default async function VolumesPage({
  params,
}: {
  params: Promise<{ journalId: string }>;
}) {
  const { journalId } = await params;

  const journal = await prisma.journal.findUnique({
    where: { id: journalId },
  });

  if (!journal) {
    notFound();
  }

  const volumes = await prisma.volume.findMany({
    where: {
      journalId,
      issues: {
        some: {
          status: "PUBLISHED",
        },
      },
    },
    include: {
      journal: true,
      issues: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: [{ publicationDate: "desc" }, { createdAt: "desc" }],
      },
    },
    orderBy: [{ year: "desc" }, { volumeNumber: "desc" }],
  });

  return (
    <>
      <BreadcrumbBanner
        title={`${journal.name} Volumes`}
        subtitle="Explore the volumes of this journal."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-center text-3xl font-semibold">
          Volumes
        </h2>
        {volumes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {volumes.map((volume) => (
              <Link
                key={volume.id}
                href={`/publications/journals/${journalId}/volumes/${volume.id}/issues`}
              >
                <Card className="rounded-none hover:shadow-md">
               <CardContent className="space-y-3 p-5">
                 <BookOpen className="h-6 w-6 text-amber-600" />
                 <h3 className="font-semibold text-slate-800">
                   Volume {volume.volumeNumber}
                 </h3>
                 <p className="text-sm text-slate-600">
                   <strong>Year:</strong> {volume.year}
                 </p>
                 <p className="text-sm text-slate-600">
                   <strong>Journal:</strong> {volume.journal.name}
                 </p>
                 <p className="text-sm text-slate-600">
                    <strong>Published Issues:</strong> {volume.issues.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Latest issue:{" "}
                    {volume.issues[0]?.publicationDate
                      ? new Date(volume.issues[0].publicationDate).toLocaleDateString("en-IN")
                      : "Date not available"}
                 </p>
               </CardContent>
                </Card>
              </Link>
            ))}
          </div>
         ) : (
           <p className="text-center text-muted-foreground">
             No volumes found for this journal.
           </p>
         )}
      </section>

      <Banner />
    </>
  );
}
