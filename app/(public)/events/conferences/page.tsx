import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  Lightbulb,
  FileText,
  Mic,
//   BookOpen,
//   Clock,
//   Share2,
} from "lucide-react";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import Banner from "@/components/banner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conferences & Symposia - MACROJ Research Journal",
  description:
    "Stay updated with the latest academic conferences and symposia organized by MACROJ and Marwari College Ranchi. Participate, network, and contribute to cutting-edge interdisciplinary research.",
  keywords: [
    "MACROJ",
    "Marwari College Ranchi",
    "Academic Conferences",
    "Research Symposia",
    "Scholarly Events",
    "Interdisciplinary Research",
    "Workshops",
    "Conferences 2025",
    "Academic Networking",
  ],
  authors: [
    {
      name: "MACROJ Editorial Team",
      url: "https://www.marwaricollege.ac.in/macroj",
    },
  ],
  creator: "MACROJ Editorial Team",
  publisher: "MACROJ Research Journal",
  openGraph: {
    title: "Conferences & Symposia - MACROJ Research Journal",
    description:
      "Join MACROJ and Marwari College Ranchi academic conferences, workshops, and symposia to advance interdisciplinary research and network with scholars.",
    url: "https://www.macroj.marwaricollege.ac.in/events/conferences",
    siteName: "MACROJ Research Journal",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "MACROJ Conferences Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conferences & Symposia - MACROJ Research Journal",
    description:
      "Participate in MACROJ academic conferences and symposia at Marwari College Ranchi. Connect, collaborate, and contribute to scholarly research.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
    creator: "@MACROJ_College",
  },
  robots: "index, follow",
  metadataBase: new URL("https://www.macroj.marwaricollege.ac.in"),
};

export default function ConferencePage() {
  return (
    <>
      <BreadcrumbBanner
        title={"Conferences"}
        subtitle="Engaging platforms for scholarly interaction, research dissemination, and intellectual collaboration."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />
      {/* ---------- Header Section ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Conferences & Symposia
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto"></p>
        <p className="mt-6 text-slate-600 max-w-3xl mx-auto leading-relaxed">
          <strong>MACROJ</strong> and <strong>Marwari College Ranchi</strong>{" "}
          regularly organize academic conferences, workshops, and symposia
          bringing together researchers, educators, and professionals from
          diverse disciplines. These events embody our commitment to{" "}
          <span className="bg-sky-50 px-1 font-semibold">
            advancing interdisciplinary dialogue
          </span>{" "}
          and promoting evidence-based academic practices.
        </p>
      </section>

      <Separator className="my-8" />

      {/* ---------- Upcoming Conferences Section ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12 rounded-none shadow-sm mb-10">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Upcoming Conferences
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title:
                "International Conference on Interdisciplinary Research & Innovation (ICIRI 2025)",
              date: "March 14–16, 2025",
              location: "Marwari College Ranchi, India",
              theme:
                "Bridging Sciences, Humanities, and Technology for Sustainable Futures",
              description:
                "A three-day event bringing together scholars from across the globe to discuss cutting-edge interdisciplinary research and emerging innovations. Keynote sessions, panel discussions, and workshops will focus on sustainable solutions and educational reform.",
              link: "#",
            },
            {
              title:
                "National Symposium on Educational Technology and Pedagogical Transformation",
              date: "August 9–10, 2025",
              location: "Marwari College Auditorium, Ranchi",
              theme: "Innovative Pedagogies for the Digital Generation",
              description:
                "This symposium explores advancements in digital education, classroom innovation, and inclusive learning design. Participants will exchange insights on integrating technology into higher education curricula.",
              link: "#",
            },
          ].map((event, i) => (
            <Card
              key={i}
              className="border-border rounded-none hover:shadow-md transition"
            >
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-sky-600" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-sky-600" />
                  <span>{event.location}</span>
                </div>
                <p>
                  <strong>Theme:</strong> {event.theme}
                </p>
                <p className="leading-relaxed">{event.description}</p>
                <Button className="mt-3">Register / Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Past Conferences Section ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12 rounded-none shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Past Conferences & Symposia
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title:
                "2024 Annual Research Symposium on Climate, Culture, and Technology",
              highlights:
                "Brought together 120+ researchers presenting papers on sustainability, green computing, and social adaptation.",
              outcomes:
                "Proceedings published in MACROJ Special Issue (2024). Several collaborations initiated across disciplines.",
            },
            {
              title:
                "2023 National Conference on Ethics and Innovation in Higher Education",
              highlights:
                "Hosted distinguished academics and policymakers to discuss ethical leadership in academia.",
              outcomes:
                "White paper on academic integrity and data transparency submitted to Ranchi University.",
            },
          ].map((past, i) => (
            <Card key={i} className="border-border rounded-none shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">{past.title}</h3>
                <p>
                  <strong>Highlights:</strong> {past.highlights}
                </p>
                <p>
                  <strong>Outcomes:</strong> {past.outcomes}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Why Attend Section ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16 rounded-none shadow-sm my-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Why Participate in MACROJ Conferences?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Users className="h-6 w-6 text-sky-600" />,
              title: "Networking",
              desc: "Engage with leading scholars, researchers, and industry professionals across disciplines.",
            },
            {
              icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
              title: "Knowledge Exchange",
              desc: "Learn about cutting-edge research trends, methodologies, and applications.",
            },
            {
              icon: <FileText className="h-6 w-6 text-emerald-600" />,
              title: "Publication Opportunities",
              desc: "Selected papers are featured in MACROJ’s peer-reviewed issues or special editions.",
            },
            {
              icon: <Mic className="h-6 w-6 text-indigo-600" />,
              title: "Scholarly Recognition",
              desc: "Presenters receive certificates and acknowledgment from the editorial board.",
            },
          ].map((v, i) => (
            <Card
              key={i}
              className="border hover:shadow-md transition rounded-none"
            >
              <CardContent className="p-5 flex flex-col items-start gap-3">
                {v.icon}
                <h3 className="font-semibold">{v.title}</h3>
                <p className="text-sm">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Call for Papers Section ---------- */}
      {/* <section className="max-w-6xl mx-auto px-6 py-12 bg-white border-t border-slate-100">
        <h2 className="text-3xl font-semibold text-center text-sky-800 mb-4">
          Call for Papers & Participation
        </h2>
        <p className="text-slate-700 text-center max-w-3xl mx-auto mb-6 leading-relaxed">
          We invite researchers, academicians, and students to contribute to
          upcoming conferences. Accepted papers may be considered for
          publication in MACROJ’s peer-reviewed issues.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-sky-700 hover:bg-sky-800">
            Submit Abstract
          </Button>
          <Button variant="outline" className="border-sky-700 text-sky-700">
            Conference Guidelines
          </Button>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              icon: <BookOpen className="h-6 w-6 text-amber-500" />,
              title: "Interdisciplinary Tracks",
              desc: "Explore tracks across science, humanities, education, and computational studies.",
            },
            {
              icon: <Clock className="h-6 w-6 text-sky-600" />,
              title: "Submission Deadlines",
              desc: "Abstracts: Feb 10, 2025 | Full Paper: Feb 25, 2025",
            },
            {
              icon: <Share2 className="h-6 w-6 text-emerald-600" />,
              title: "Collaborative Impact",
              desc: "Our conferences foster academic exchange and long-term institutional partnerships.",
            },
          ].map((info, i) => (
            <Card
              key={i}
              className="bg-slate-50 border border-slate-200 hover:shadow-md transition"
            >
              <CardContent className="p-5 flex flex-col items-start gap-3">
                {info.icon}
                <h3 className="font-semibold text-slate-800">{info.title}</h3>
                <p className="text-sm text-slate-600">{info.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      <Banner />
    </>
  );
}
