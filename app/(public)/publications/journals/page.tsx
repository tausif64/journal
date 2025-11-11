import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Calendar,
  FileText,
  Globe,
  PenTool,
  Lightbulb,
  Users,
  ArrowRight,
} from "lucide-react";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Journals - MACROJ Research Journal",
  description:
    "Discover the current and past issues of MACROJ Research Journal, featuring peer-reviewed articles across science, humanities, education, technology, and interdisciplinary research. Explore Volume 6, Issue 1 (2025) on innovation, ethics, and society.",
  keywords: [
    "MACROJ",
    "research journal",
    "academic journals",
    "current issue",
    "Volume 6 Issue 1",
    "interdisciplinary research",
    "AI in education",
    "climate ethics",
    "data-driven governance",
    "peer-reviewed articles",
  ],
  authors: [{ name: "Marwari College Ranchi" }],
  openGraph: {
    title: "Academic Journals - MACROJ Research Journal",
    description:
      "Browse MACROJ's latest and previous issues. Access peer-reviewed research on science, humanities, technology, and education.",
    url: "https://yourdomain.com/publications/journals",
    siteName: "MACROJ Research Journal",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "MACROJ Journals Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Academic Journals - MACROJ Research Journal",
    description:
      "Explore MACROJ's current and past issues with peer-reviewed articles in science, humanities, education, and technology.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
  },
};

export default function JournalsPage() {
  return (
    <>
      <BreadcrumbBanner
        title={"Journals"}
        subtitle="Explore the breadth of scholarly work published under the MACROJ Research Journal  — advancing interdisciplinary thought, ethics, and
          innovation."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />
      {/* ---------- Header Section ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Our Academic Journals
        </h1>
        <p className="mt-6  max-w-3xl mx-auto leading-relaxed">
          <span className="bg-sky-50 px-1 font-semibold">MACROJ</span> is a
          peer-reviewed publication offering diverse insights across sciences,
          humanities, technology, and education. Our editorial vision emphasizes
          academic rigor, ethical integrity, and societal impact.
        </p>
      </section>

      <Separator className="my-8" />

      {/* ---------- Current Issue Section ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Current Issue: Volume 6, Issue 1 (2025)
        </h2>

        <Card className="rounded-none hover:shadow-md transition max-w-4xl mx-auto">
          <CardContent className="p-6 space-y-3 text-center">
            <BookOpen className="h-10 w-10 mx-auto" />
            <h3 className="text-xl font-semibold">
              &quot;Innovation, Ethics, and Society: The Future of
              Interdisciplinary Research&quot;
            </h3>
            <div className="flex justify-center items-center gap-2  text-sm">
              <Calendar className="h-4 w-4 text-sky-600" />
              <span>Published: February 2025</span>
            </div>
            <p className="text-slate-700 max-w-2xl mx-auto leading-relaxed">
              This issue presents research exploring how innovation intersects
              with ethics, sustainability, and cultural perspectives across
              multiple disciplines.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> View Full Issue
              </Button>
              <Button variant="outline">
                <PenTool className="h-4 w-4" /> Submit Paper
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---------- Browse Journals by Discipline ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16 rounded-none shadow-sm">
        <h2 className="text-3xl font-semibold mb-8 text-emerald-800 text-center">
          Browse by Discipline
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Science & Technology",
              desc: "Research in physical, chemical, biological, and computational sciences advancing innovation and applied technology.",
              color: "text-sky-700",
            },
            {
              title: "Humanities & Social Sciences",
              desc: "Exploring philosophy, literature, linguistics, psychology, and cultural studies from global and regional perspectives.",
              color: "text-emerald-700",
            },
            {
              title: "Education & Pedagogy",
              desc: "Focusing on educational reform, curriculum innovation, and learner-centered practices in the digital era.",
              color: "text-indigo-700",
            },
            {
              title: "Economics & Commerce",
              desc: "Studies on sustainable business, entrepreneurship, financial systems, and socio-economic development.",
              color: "text-amber-700",
            },
            {
              title: "Environmental Studies",
              desc: "Integrating environmental science, sustainability research, and policy-making for resilient futures.",
              color: "text-teal-700",
            },
            {
              title: "Interdisciplinary Research",
              desc: "Papers that transcend disciplinary boundaries, connecting technology, art, and human values.",
              color: "text-slate-700",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="bg-white border border-slate-200 hover:shadow-md transition rounded-none"
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <h3 className={`font-semibold ${item.color}`}>{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
                <Button
                  variant="ghost"
                  className="self-start text-sky-700 hover:text-sky-900 hover:bg-sky-50"
                >
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Recent Publications ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Recent Publications
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "AI in Education: Designing Inclusive Classrooms",
              author: "Dr. Neha Sharma",
              field: "Education & Technology",
            },
            {
              title: "The Cultural Ethics of Climate Communication",
              author: "Prof. Rajesh Kumar",
              field: "Humanities & Environmental Studies",
            },
            {
              title: "Data-driven Governance and Citizen Engagement",
              author: "Dr. Arjun Menon",
              field: "Public Policy & Technology",
            },
          ].map((pub, i) => (
            <Card key={i} className="rounded-none hover:shadow-md transition">
              <CardContent className="p-5 space-y-3">
                <Lightbulb className="h-6 w-6 text-amber-500" />
                <h3 className="font-semibold text-slate-800">{pub.title}</h3>
                <p className="text-sm text-slate-600">
                  <strong>Author:</strong> {pub.author}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Field:</strong> {pub.field}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Editorial Policy Section ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12 bg-white border-t border-slate-100">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Editorial Policy & Publication Scope
        </h2>
        <p className=" text-center max-w-4xl mx-auto mb-8 leading-relaxed">
          The <strong>MACROJ Research Journal</strong> publishes original
          research articles, review papers, and case studies that adhere to{" "}
          <span className="bg-emerald-50 px-1 font-semibold">
            ethical, peer-reviewed standards
          </span>
          . Our editorial board comprises distinguished academicians ensuring
          quality and authenticity in each publication.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Users className="h-6 w-6 text-sky-600" />,
              title: "Peer Review",
              desc: "Every paper undergoes a double-blind peer review process.",
            },
            {
              icon: <FileText className="h-6 w-6 text-emerald-600" />,
              title: "Ethical Integrity",
              desc: "We strictly adhere to international research and publication ethics.",
            },
            {
              icon: <Globe className="h-6 w-6 text-indigo-600" />,
              title: "Global Reach",
              desc: "Our journal is accessible to scholars and libraries worldwide.",
            },
            {
              icon: <BookOpen className="h-6 w-6 text-amber-500" />,
              title: "Academic Excellence",
              desc: "Committed to publishing impactful, cross-disciplinary research.",
            },
          ].map((item, i) => (
            <Card key={i} className="rounded-none hover:shadow-md transition">
              <CardContent className="p-5 flex flex-col items-start gap-3">
                {item.icon}
                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
