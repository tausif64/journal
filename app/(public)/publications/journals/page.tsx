import { Metadata } from "next";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Banner from "@/components/banner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Academic Journals - MACROJ Research Journal",
  description:
    "Discover current and past issues of MACROJ Research Journal with peer-reviewed publications.",
};

export default async function JournalsPage() {
  const currentIssue = await prisma.issue.findFirst({
    where: { status: "PUBLISHED" },
    include: {
      volume: {
        include: {
          journal: true,
        },
      },
    },
    orderBy: [{ publicationDate: "desc" }, { createdAt: "desc" }],
  });

  const journals = await prisma.journal.findMany({
    where: {
      volume: {
        some: {
          issue: {
            some: {
              status: "PUBLISHED",
            },
          },
        },
      },
    },
    include: {
      volume: {
        orderBy: [{ year: "desc" }, { volumeNumber: "desc" }],
        include: {
          issue: {
            where: { status: "PUBLISHED" },
            orderBy: [{ publicationDate: "desc" }, { createdAt: "desc" }],
          },
        },
      },
    },
  });

  const recentJournals = journals
    .map((journal) => {
      const publishedVolumes = journal.volume.filter(
        (volume) => volume.issue.length > 0
      );
      const latestVolume = publishedVolumes[0] ?? null;
      const latestIssue = latestVolume?.issue[0] ?? null;

      return {
        ...journal,
        publishedVolumes,
        latestVolume,
        latestIssue,
      };
    })
    .filter((journal) => journal.latestVolume && journal.latestIssue)
    .sort((a, b) => {
      const aDate = a.latestIssue?.publicationDate ?? a.latestIssue?.createdAt;
      const bDate = b.latestIssue?.publicationDate ?? b.latestIssue?.createdAt;
      return new Date(bDate ?? 0).getTime() - new Date(aDate ?? 0).getTime();
    })
    .slice(0, 6);

  return (
    <>
      <BreadcrumbBanner
        title="Journals"
        subtitle="Explore currently published and recent journal issues from MACROJ."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />

       <section className="mx-auto max-w-6xl px-6 py-12">
         <h2 className="mb-6 text-center text-3xl font-semibold">
           Current Journal
         </h2>
         {currentIssue ? (
           <Link href={`/publications/journals/${currentIssue.volume.journal.id}/volumes`}>
             <Card className="mx-auto max-w-4xl rounded-none border-slate-200 hover:shadow-md">
               <CardContent className="space-y-3 p-6 text-center">
                 <BookOpen className="mx-auto h-10 w-10" />
                 <h3 className="text-xl font-semibold">
                   {currentIssue.volume.journal.name} - Volume{" "}
                   {currentIssue.volume.volumeNumber}, Issue{" "}
                   {currentIssue.issueNumber}
                 </h3>
                 <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                   <Calendar className="h-4 w-4 text-sky-600" />
                   <span>
                     {currentIssue.volume.year} • {currentIssue.status}
                   </span>
                 </div>
                 <div className="flex flex-wrap justify-center gap-3 pt-2">
                   <Badge variant="outline">
                     ISSN: {currentIssue.volume.journal.issn}
                   </Badge>
                   <Badge variant="outline">
                     Published:{" "}
                     {new Date(currentIssue.createdAt).toLocaleDateString("en-IN")}
                   </Badge>
                 </div>
               </CardContent>
             </Card>
           </Link>
         ) : (
           <Card className="mx-auto max-w-4xl rounded-none">
             <CardContent className="p-6 text-center text-muted-foreground">
               No journal issues available yet.
             </CardContent>
           </Card>
         )}
       </section>

      <Separator />

       <section className="mx-auto max-w-6xl px-6 py-12">
         <h2 className="mb-8 text-center text-3xl font-semibold">
           Recent Journals
         </h2>
         {recentJournals.length > 0 ? (
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {recentJournals.map((journal) => (
               <Link key={journal.id} href={`/publications/journals/${journal.id}/volumes`}>
                 <Card className="rounded-none hover:shadow-md">
                   <CardContent className="space-y-3 p-5">
                     <FileText className="h-6 w-6 text-amber-600" />
                     <h3 className="font-semibold text-slate-800">
                       {journal.name}
                     </h3>
                     <p className="text-sm text-slate-600">
                       <strong>Latest Volume:</strong> {journal.latestVolume?.volumeNumber} (
                       {journal.latestVolume?.year})
                     </p>
                     <p className="text-sm text-slate-600">
                       <strong>Latest Issue:</strong> {journal.latestIssue?.issueNumber}
                     </p>
                     <p className="text-sm text-slate-600">
                       <strong>Published Volumes:</strong> {journal.publishedVolumes.length}
                     </p>
                     <p className="text-sm text-slate-600">
                       <strong>ISSN:</strong> {journal.issn}
                     </p>
                     <p className="text-xs text-muted-foreground">
                       {new Date(
                         journal.latestIssue?.publicationDate ?? journal.latestIssue?.createdAt ?? new Date()
                       ).toLocaleDateString("en-IN")}
                     </p>
                   </CardContent>
                 </Card>
               </Link>
             ))}
           </div>
         ) : (
           <p className="text-center text-muted-foreground">
             No recent journal issues found.
           </p>
         )}
       </section>

      <Banner />
    </>
  );
}
