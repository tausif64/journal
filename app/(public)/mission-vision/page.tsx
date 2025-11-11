import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Target,
  ShieldCheck,
  Users,
  FileText,
  Globe,
  Lightbulb,
  PenTool,
  Share2,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission & Vision - MACROJ Research Journal",
  description:
    "Discover MACROJ's mission to advance interdisciplinary, ethical, and high-quality research. Learn about our vision for global collaboration and knowledge dissemination.",
  keywords: [
    "MACROJ",
    "Mission",
    "Vision",
    "Academic Journal",
    "Research Ethics",
    "Peer-Reviewed",
    "Marwari College Ranchi",
    "Interdisciplinary Research",
    "Scholarly Publication",
    "Global Knowledge",
  ],
  authors: [
    { name: "MACROJ Editorial Team", url: "https://yourdomain.com/macroj" },
  ],
  creator: "MACROJ Editorial Team",
  publisher: "MACROJ Research Journal",
  robots: "index, follow",
  metadataBase: new URL("https://yourdomain.com/"),
  openGraph: {
    title: "Our Mission & Vision - MACROJ Research Journal",
    description:
      "Explore MACROJ's mission and vision to foster ethical, interdisciplinary research and global knowledge dissemination from Marwari College Ranchi.",
    url: "https://yourdomain.com/mission-vision",
    siteName: "MACROJ Research Journal",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "MACROJ Mission & Vision Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Mission & Vision - MACROJ Research Journal",
    description:
      "Learn about MACROJ’s mission to promote high-quality, ethical, and interdisciplinary research at Marwari College Ranchi.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
    creator: "@MACROJ_College",
  },
};

const Page = () => {
  return (
    <>
      <BreadcrumbBanner
        title={"Mission & Vision"}
        subtitle="Empowering research excellence, ethical publication, and global knowledge exchange for academic and societal advancement."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />
      {/* ---------- Header Section ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Our Mission & Vision
        </h1>
        <p className="mt-6 text-slate-600 max-w-3xl mx-auto leading-relaxed">
          <strong>MACROJ</strong>, a peer-reviewed international journal
          published by{" "}
          <span className="font-semibold bg-sky-50 px-1">
            Marwari College Ranchi
          </span>
          , strives to provide a distinguished platform for high-quality
          interdisciplinary research under the auspices of Ranchi University.
          The journal is a reflection of the college’s commitment to{" "}
          <span className="font-semibold bg-emerald-50 px-1">
            academic innovation, ethics, and global collaboration.
          </span>
        </p>
      </section>

      <Separator />

      {/* ---------- Mission Section ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-semibold mb-4 text-sky-800">
              Our Mission
            </h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              The mission of <strong>MACROJ</strong> is to{" "}
              <span className="font-semibold bg-sky-50 px-1">
                bridge disciplinary divides
              </span>{" "}
              and foster integrated academic inquiry across science, humanities,
              education, and technology. We are dedicated to{" "}
              <span className="font-semibold bg-amber-50 px-1">
                nurturing intellectual curiosity
              </span>{" "}
              and supporting ethical, high-impact research that inspires new
              knowledge and positive change.
            </p>

            <h4 className="text-lg font-semibold text-slate-700 mb-2">
              Key Objectives:
            </h4>
            <ul className="space-y-3">
              {[
                "Provide a credible and inclusive platform for original, peer-reviewed research.",
                "Encourage interdisciplinary and transdisciplinary collaboration to address real-world challenges.",
                "Promote academic mentorship and researcher development through fair editorial processes.",
                "Uphold ethical research and publication standards to ensure transparency and trust.",
                "Facilitate global dissemination of ideas that contribute to educational and policy transformation.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-sky-600 mt-1" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="bg-sky-50/50 border-sky-100 shadow-sm rounded-none">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-semibold text-sky-700">
                Editorial Ethos
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                MACROJ maintains a{" "}
                <span className="font-semibold bg-sky-100 px-1">
                  double-blind peer review
                </span>{" "}
                process, ensuring fairness, integrity, and constructive
                scholarship. Our editors are committed to transparency and
                continuous improvement of academic quality.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ---------- Vision Section ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12" id="vision">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-semibold mb-4 text-emerald-800">
              Our Vision
            </h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              <strong>MACROJ</strong> envisions evolving into a{" "}
              <span className="font-semibold bg-emerald-50 px-1">
                globally recognized journal of excellence
              </span>{" "}
              that sets benchmarks in ethical, open, and interdisciplinary
              scholarship. We aspire to build an ecosystem where{" "}
              <span className="font-semibold bg-blue-50 px-1">
                research transforms ideas into impact
              </span>{" "}
              and knowledge serves humanity.
            </p>

            <h4 className="text-lg font-semibold text-slate-700 mb-2">
              Long-Term Aspirations:
            </h4>
            <ul className="space-y-3">
              {[
                "Expand MACROJ’s global reach as a hub for multidisciplinary research collaboration.",
                "Enhance visibility of Indian and regional scholarship in the global academic landscape.",
                "Encourage open access publishing for greater knowledge equity.",
                "Support innovation, mentorship, and outreach that connect academia with society.",
              ].map((goal, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-emerald-600 mt-1" />
                  <span className="text-slate-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm rounded-none">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-semibold text-emerald-700">
                Future Outlook
              </h3>
              <p className="text-sm text-slate-700">
                We aim to expand partnerships with academic networks and build a
                robust digital archive for{" "}
                <span className="font-semibold bg-emerald-100 px-1">
                  open-access dissemination
                </span>
                , ensuring every scholar’s voice contributes to global
                knowledge.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ---------- Core Values Section ---------- */}
      <Card className="max-w-6xl mx-auto px-6 py-12 rounded-none mb-10 gap-0">
        <CardHeader>
          <CardTitle>
            {" "}
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Core Editorial Values
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Integrity",
              desc: "We ensure originality, authenticity, and accountability in every publication.",
              icon: <ShieldCheck className="h-6 w-6 text-sky-600" />,
            },
            {
              title: "Collaboration",
              desc: "Interdisciplinary teamwork drives our peer-review process and outreach programs.",
              icon: <Users className="h-6 w-6 text-emerald-600" />,
            },
            {
              title: "Innovation",
              desc: "We embrace new research paradigms, methodologies, and technologies.",
              icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
            },
            {
              title: "Transparency",
              desc: "All editorial processes are governed by fairness, feedback, and ethical review.",
              icon: <FileText className="h-6 w-6 text-indigo-600" />,
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
        </CardContent>
      </Card>

      {/* ---------- Additional Section ---------- */}
      <Card className="max-w-6xl gap-3 mx-auto px-6 py-12 bg-slate-50 rounded-none gap-0bmmmmmmm border border-slate-100">
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl font-semibold mb-4 text-center text-slate-800">
              Research Philosophy
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 max-w-4xl mx-auto leading-relaxed text-center">
            At <strong>MACROJ</strong>, we believe that true research extends
            beyond publication—it shapes learning, informs policy, and empowers
            communities. Guided by{" "}
            <span className="font-semibold bg-sky-50 px-1">
              ethics, evidence, and empathy
            </span>
            , we support open dialogue and capacity building among researchers
            at every stage of their academic journey.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: <PenTool className="h-6 w-6 text-sky-600" />,
                title: "Academic Rigor",
                desc: "Every manuscript is reviewed for methodological soundness and originality.",
              },
              {
                icon: <Share2 className="h-6 w-6 text-emerald-600" />,
                title: "Open Communication",
                desc: "We value transparent reviewer-author interactions that improve scholarly work.",
              },
              {
                icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
                title: "Knowledge Impact",
                desc: "Our goal is to ensure that each publication contributes meaningfully to society.",
              },
            ].map((p, i) => (
              <Card
                key={i}
                className="bg-white border-slate-200 hover:shadow-md transition rounded-none"
              >
                <CardContent className="p-5 flex flex-col items-start gap-3">
                  {p.icon}
                  <h3 className="font-semibold text-slate-800">{p.title}</h3>
                  <p className="text-sm text-slate-600">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
