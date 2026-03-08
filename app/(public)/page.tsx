import AboutContent from "@/components/about-content";
import Banner from "@/components/banner";
import { FAQ } from "@/components/faq";
import Hero from "@/components/hero";
import { PublicationTimeline } from "@/components/publication-timeline";
import TestimonialCarousel from "@/components/testimonial-carousel";
import WhyPublish from "@/components/why-publish";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "MACROJ Research Journal - Multidisciplinary Academic Research",
  description:
    "Welcome to MACROJ, the peer-reviewed research journal of Marwari College Ranchi. Explore cutting-edge research across science, humanities, technology, education, and interdisciplinary studies. Access current issues, archives, and open-access publications.",
  keywords: [
    "MACROJ",
    "Marwari College Ranchi",
    "research journal",
    "multidisciplinary research",
    "open access",
    "academic publications",
    "science research",
    "humanities research",
    "education research",
    "technology research",
    "interdisciplinary research",
    "Tausif Ansari",
  ],
  authors: [{ name: "Marwari College Ranchi" }],
  openGraph: {
    title: "MACROJ Research Journal - Multidisciplinary Academic Research",
    description:
      "Discover the MACROJ Research Journal: peer-reviewed articles, interdisciplinary insights, and open-access scholarly research from Marwari College Ranchi.",
    url: "https://yourdomain.com/",
    siteName: "MACROJ Research Journal",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "MACROJ Research Journal Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MACROJ Research Journal - Multidisciplinary Academic Research",
    description:
      "Explore MACROJ: a peer-reviewed, open-access journal featuring research across sciences, humanities, education, and technology.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
  },
};

export default async function Home() {
  const currentDraftIssue = await prisma.issue.findFirst({
    where: { status: "DRAFT" },
    include: {
      volume: {
        select: {
          year: true,
          volumeNumber: true,
        },
      },
    },
    orderBy: [
      { volume: { year: "desc" } },
      { volume: { volumeNumber: "desc" } },
      { issueNumber: "desc" },
    ],
  });

  const fallbackLatestIssue =
    currentDraftIssue ??
    (await prisma.issue.findFirst({
      include: {
        volume: {
          select: {
            year: true,
            volumeNumber: true,
          },
        },
      },
      orderBy: [
        { volume: { year: "desc" } },
        { volume: { volumeNumber: "desc" } },
        { issueNumber: "desc" },
      ],
    }));

  const currentVolumeIssueText = fallbackLatestIssue
    ? `Volume ${fallbackLatestIssue.volume.volumeNumber} (${fallbackLatestIssue.volume.year}), Issue ${fallbackLatestIssue.issueNumber}`
    : null;

  return (
    <>
      <Hero />
      <AboutContent
        title={"ABOUT THE JOURNAL"}
        description={
          "MACROJ is an international peer-reviewed journal dedicated to publishing high-quality research that provides cross-disciplinary insights. The journal is published under the auspices of Marwari College Ranchi, a NAAC accredited autonomous college with potential for excellence, under Ranchi University."
        }
        desc2={
          "It operates as part of the college’s commitment to advancing interdisciplinary research and scholarly communication. The mission of the journal is to bridge disciplinary divides and promote integrated academic inquiry across sciences, humanities, education, technology, and traditional knowledge and wisdom."
        }
        image={"/about.jpg"}
      />
      <section className="bg-slate-50 border-y">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold tracking-wide text-primary">
              CALL FOR PAPERS
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              We are accepting papers for the current Volume &amp; Issue
            </h2>
            {currentVolumeIssueText ? (
              <p className="mt-2 text-sm font-medium text-slate-800 md:text-base">
                Currently Open: {currentVolumeIssueText}
              </p>
            ) : (
              <p className="mt-2 text-sm font-medium text-slate-800 md:text-base">
                Current volume and issue will be announced soon.
              </p>
            )}
            <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
              Authors are invited to submit original and unpublished research
              manuscripts for the ongoing publication cycle. Submit your article
              now to be considered for peer review in the current volume and
              issue.
            </p>
            <div className="mt-5">
              <a
                href="/dashboard/submit"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Submit Paper
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Publication process */}
      <PublicationTimeline />

      {/* submit paper banner */}
      <Banner />

      {/* Why to Publish in MACROJ*/}
      <WhyPublish />

      {/* Testimonial */}
      <TestimonialCarousel />

      {/* Frequently Asked Questions */}
      <FAQ />
    </>
  );
}
