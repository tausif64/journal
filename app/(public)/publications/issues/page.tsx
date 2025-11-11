import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Calendar,
  FileText,
  Archive,
  Award,
  Download,
  Globe,
  Search,
} from "lucide-react";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";

export const metadata = {
  title: "Past Issues & Archives - MACROJ Research Journal",
  description:
    "Explore MACROJ's previous volumes, special issues, and research archives. Access scholarly work across AI, education, science, humanities, and social sciences from 2021 to 2024.",
  keywords: [
    "MACROJ",
    "research journal",
    "past issues",
    "archives",
    "AI research",
    "education research",
    "science journals",
    "humanities research",
    "special issues",
    "open access",
  ],
  authors: [{ name: "Marwari College Ranchi" }],
  openGraph: {
    title: "Past Issues & Archives - MACROJ Research Journal",
    description:
      "Delve into MACROJ’s collection of past volumes, special issues, and notable research papers across multiple disciplines.",
    url: "https://yourdomain.com//publications/issues",
    siteName: "MACROJ Research Journal",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "MACROJ Past Issues Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Past Issues & Archives - MACROJ Research Journal",
    description:
      "Explore previous volumes, special issues, and notable research papers from MACROJ, the multidisciplinary research journal of Marwari College Ranchi.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
  },
};


export default function PastIssuesPage() {
  return (
    <>
      <BreadcrumbBanner
        title={"Past Issues"}
        subtitle=" Delve into MACROJ’s extensive collection of previously published volumes and special issues, representing the depth and diversity of global research."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />
      {/* ---------- Header Section ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Past Issues & Research Archives
        </h1>
        <p className="mt-6 text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Since its inception, <strong>MACROJ</strong> has been committed to
          disseminating scholarly work across a spectrum of disciplines—
          science, humanities, social sciences, and education. Each issue
          reflects our mission to promote{" "}
          <span className="bg-sky-50 px-1 font-semibold">
            interdisciplinary knowledge and ethical inquiry.
          </span>
        </p>
      </section>

      <Separator className="my-8" />

      {/* ---------- Explore Volumes ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12 rounded-none shadow-sm">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Explore Previous Volumes
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Volume 5, Issue 2 (2024)",
              theme:
                "Emerging Trends in Artificial Intelligence and Humanities",
              date: "Published: July 2024",
              desc: "This issue highlights interdisciplinary approaches that connect AI, ethics, and social innovation through diverse academic perspectives.",
            },
            {
              title: "Volume 5, Issue 1 (2024)",
              theme: "Education, Digital Learning, and Sustainable Development",
              date: "Published: January 2024",
              desc: "Focused on pedagogical innovation and sustainability education, this volume explores technology’s role in shaping equitable learning environments.",
            },
            {
              title: "Volume 4, Issue 2 (2023)",
              theme: "Science, Society & Policy Integration",
              date: "Published: August 2023",
              desc: "Papers in this issue examine how policy frameworks intersect with research outcomes to impact community well-being.",
            },
            {
              title: "Volume 4, Issue 1 (2023)",
              theme: "Interdisciplinary Research Methodologies",
              date: "Published: March 2023",
              desc: "Highlights robust methodologies in humanities, education, and scientific inquiry, emphasizing innovation in research practice.",
            },
          ].map((issue, i) => (
            <Card key={i} className="rounded-none hover:shadow-md transition">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">{issue.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-sky-600" />
                  <span>{issue.date}</span>
                </div>
                <p>
                  <strong>Theme:</strong> {issue.theme}
                </p>
                <p className=" leading-relaxed">{issue.desc}</p>
                <div className="flex gap-3">
                  <Button>
                    <Download className="h-4 w-4 mr-2" /> View Issue
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" /> Abstracts
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* ---------- Special Issues ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12 rounded-none shadow-sm">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Special Thematic Issues
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title:
                "Special Issue (2022): Innovation for Sustainable Societies",
              summary:
                "This special issue curated research across environmental sciences, economics, and education, emphasizing sustainable community models.",
            },
            {
              title:
                "Special Issue (2021): Post-Pandemic Research Paradigms in Higher Education",
              summary:
                "Explored the transformation of learning, pedagogy, and institutional resilience during and after the COVID-19 pandemic.",
            },
          ].map((special, i) => (
            <Card key={i} className="rounded-none hover:shadow-md transition">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-semibold text-emerald-900">
                  {special.title}
                </h3>
                <p className="text-slate-700">{special.summary}</p>
                <Button
                  variant="outline"
                  className="border-emerald-700 text-emerald-700"
                >
                  <BookOpen className="h-4 w-4 mr-2" /> Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* ---------- Research Highlights ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Research Highlights & Notable Papers
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "AI and Ethics: Building Responsible Systems",
              author: "Dr. Meera Sinha",
              issue: "Vol 5, Issue 2 (2024)",
            },
            {
              title: "Traditional Knowledge and Modern Science Synergy",
              author: "Prof. R. K. Pandey",
              issue: "Vol 4, Issue 1 (2023)",
            },
            {
              title: "Digital Literacy as a Social Equalizer",
              author: "Dr. S. N. Paul",
              issue: "Vol 5, Issue 1 (2024)",
            },
          ].map((paper, i) => (
            <Card
              key={i}
              className="bg-white border border-slate-200 hover:shadow-md transition rounded-none"
            >
              <CardContent className="p-5 space-y-3">
                <Award className="h-6 w-6 text-amber-500" />
                <h3 className="font-semibold text-slate-800">{paper.title}</h3>
                <p className="text-sm text-slate-600">
                  <strong>Author:</strong> {paper.author}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Published in:</strong> {paper.issue}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* ---------- Access & Archive Info ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center ">
          Open Access & Digital Archive Policy
        </h2>
        <p className="text-slate-700 text-center max-w-4xl mx-auto mb-8 leading-relaxed">
          <strong>MACROJ</strong> operates on an{" "}
          <span className="bg-amber-50 px-1 font-semibold">
            Open Access model
          </span>
          , ensuring that all published research is freely available to readers
          and scholars worldwide. The journal maintains an indexed digital
          repository of all past issues, accessible via the institutional
          archive and DOI indexing platforms.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Archive className="h-6 w-6 text-sky-600" />,
              title: "Digital Repository",
              desc: "Access all published volumes online through our archive portal.",
            },
            {
              icon: <Globe className="h-6 w-6 text-emerald-600" />,
              title: "Global Access",
              desc: "Open to readers across institutions and countries without restrictions.",
            },
            {
              icon: <Search className="h-6 w-6 text-indigo-600" />,
              title: "Indexed Discovery",
              desc: "All articles are indexed for scholarly visibility and citation tracking.",
            },
            {
              icon: <FileText className="h-6 w-6 text-amber-500" />,
              title: "Citation Ready",
              desc: "Each paper includes full metadata and digital identifiers for referencing.",
            },
          ].map((v, i) => (
            <Card
              key={i}
              className="bg-slate-50 border border-slate-200 hover:shadow-md transition rounded-none"
            >
              <CardContent className="p-5 flex flex-col items-start gap-3">
                {v.icon}
                <h3 className="font-semibold text-slate-800">{v.title}</h3>
                <p className="text-sm text-slate-600">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
