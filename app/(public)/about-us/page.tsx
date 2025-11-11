import Image from "next/image";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import Banner from "@/components/banner";

export const metadata: Metadata = {
  title: "About the Journal | MACROJ",
  description:
    "Learn more about MACROJ — an interdisciplinary, peer-reviewed journal published by Marwari College Ranchi, promoting academic excellence and collaborative research.",
  keywords: [
    "MACROJ",
    "Marwari College Ranchi",
    "Academic Journal",
    "Peer-reviewed Research",
    "Interdisciplinary Studies",
    "Scholarly Publishing",
    "Research Journal",
  ],
  openGraph: {
    title: "About the Journal | MACROJ",
    description:
      "Discover MACROJ’s mission, vision, and editorial structure — a peer-reviewed journal fostering interdisciplinary research from Marwari College Ranchi.",
    url: "https://yourdomain.com/about-us",
    siteName: "MACROJ",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "About MACROJ Journal Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About the Journal | MACROJ",
    description:
      "Learn about MACROJ — its vision, scope, and editorial board under Marwari College Ranchi.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
  },
};


export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <BreadcrumbBanner
        title="About the Journal"
        subtitle="Learn more about MACROJ — its vision, scope, and editorial structure."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />

      {/* Content Section */}
      <section className="container mx-auto px-6 py-12 space-y-6">
        {/* ABOUT THE JOURNAL */}
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          <div className="flex-1 p-3">
            <Image
              src={"https://placehold.co/1200x600/FF5733/FFFFFF.png"}
              alt={""}
              width={100}
              height={100}
              className="w-full object-cover max-h-100 h-full min-h-70 min-w-full"
            />
          </div>
          <div className="flex-1 text-muted-foreground text-base text-justify leading-relaxed space-y-4">
            <p>
              <strong>MACROJ</strong> is an international peer-reviewed journal
              dedicated to publishing high-quality research that provides
              cross-disciplinary insights. The journal is published under the
              auspices of <strong>Marwari College Ranchi</strong>, a
              <strong> NAAC accredited autonomous college</strong> with
              potential for excellence, under Ranchi University.
            </p>

            <p>
              It operates as part of the college’s commitment to advancing
              interdisciplinary research and scholarly communication. The
              mission of the journal is to bridge disciplinary divides and
              promote integrated academic inquiry across sciences, humanities,
              education, technology, and traditional knowledge and wisdom.
            </p>

            <p>
              The journal seeks to provide a platform for academicians,
              researchers, and students to share knowledge and present their new
              research findings.
            </p>
          </div>
        </div>

        <Separator />

        {/* PRINCIPAL SECTION */}
        <Card className="shadow-sm border-border/60 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              From the Principal’s Desk
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-48 h-48 rounded-md overflow-hidden shrink-0 border">
              <Image
                src="https://placehold.co/400x400/33FF57/FFFFFF.png"
                alt="Principal of Marwari College Ranchi"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="text-muted-foreground leading-relaxed text-justify">
              <p>
                <strong>Dr. Manoj Kumar</strong> — Principal, Marwari College
                Ranchi, extends warm wishes to the contributors and readers of
                MACROJ. Under his leadership, the college continues to promote a
                culture of academic excellence and interdisciplinary
                collaboration.
              </p>
              <p className="mt-3">
                The journal reflects the institution’s vision of fostering a
                robust research ecosystem that encourages innovation, ethics,
                and inclusivity in academia.
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* SCOPE OF THE JOURNAL */}
        <Card className="shadow-sm border-border/60 rounded-none gap-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Scope of the Journal
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3 text-muted-foreground text-base leading-relaxed space-y-4">
            <div className="flex-1 p-3">
              <p className="font-semibold mb-2">
                We invite original, rigorous, and well-documented research
                articles that:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Present new insights or theoretical developments</li>
                <li>
                  Address practical or pedagogical issues through academic
                  inquiry
                </li>
                <li>
                  Demonstrate interdisciplinary or transdisciplinary relevance
                </li>
                <li>Are of interest to an academic or professional audience</li>
              </ul>
            </div>
            <div className="flex-1 p-3">
              <p className="font-semibold mb-2">
                Accepted articles may cover, but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Science and Technology Studies</li>
                <li>Education and Pedagogy</li>
                <li>Environmental and Sustainability Studies</li>
                <li>Social Sciences and Humanities</li>
                <li>Mathematics and Computational Research</li>
                <li>Applied or Policy-Oriented Research</li>
                <li>Case Studies, and Qualitative or Quantitative Research</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* EDITORIAL STRUCTURE */}
        <Card className="shadow-sm border-border/60 gap-0 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Editorial Structure and Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row-reverse">
            <div className="flex-1 p-3">
              <Image
                src={"https://placehold.co/400x400/FF5733/FFFFFF.png"}
                alt={""}
                width={100}
                height={100}
                className="w-full object-cover max-h-70 h-full"
              />
            </div>
            <div className="flex-1 p-3 text-muted-foreground leading-relaxed space-y-4 text-justify">
              <p>
                The journal is overseen by the <strong>Chief Editor</strong> who
                works collaboratively with:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Associate Editors:</strong> Manage specific subject
                  areas and recommend reviewers
                </li>
                <li>
                  <strong>Co-editors:</strong> Support editorial processing,
                  issue planning, peer review, and ensure quality and integrity
                  of the journal
                </li>
                <li>
                  <strong>Editorial Advisory Board:</strong> Provides strategic
                  guidance and support for maintaining the quality of the
                  journal
                </li>
              </ul>

              <p>
                All editorial members are selected for their expertise and
                commitment to academic excellence. The editorial board is
                regularly reviewed and updated to reflect evolving academic
                priorities.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
      <Banner />
    </>
  );
}
