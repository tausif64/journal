import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Video,
  Calendar,
  Clock,
  Mic,
  Users,
  MessageSquare,
  Share2,
  BookOpen,
  Globe,
} from "lucide-react";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webinars & Online Discussions - MACROJ Research Journal",
  description:
    "Join MACROJ live webinars, panel talks, and e-discussions to engage with researchers, educators, and experts globally. Participate in knowledge exchange, scholarly collaboration, and interdisciplinary learning.",
  keywords: [
    "MACROJ",
    "Webinars",
    "Online Discussions",
    "Academic Webinars",
    "Research Exchange",
    "Interdisciplinary Learning",
    "Live Sessions",
    "Scholarly Collaboration",
    "Education",
  ],
  authors: [
    { name: "MACROJ Editorial Team", url: "https://yourdomain.com/macroj" },
  ],
  creator: "MACROJ Editorial Team",
  publisher: "MACROJ Research Journal",
  openGraph: {
    title: "Webinars & Online Discussions - MACROJ Research Journal",
    description:
      "Participate in MACROJ webinars and online sessions to connect with global researchers and educators, explore emerging themes, and share knowledge.",
    url: "https://yourdomain.com/events/webinars",
    siteName: "MACROJ Research Journal",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "MACROJ Webinars Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Webinars & Online Discussions - MACROJ Research Journal",
    description:
      "Join MACROJ online webinars and discussions to learn, network, and collaborate with global academic communities.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
    creator: "@MACROJ_College",
  },
  robots: "index, follow",
  metadataBase: new URL("https://yourdomain.com/"),
};


export default function WebinarPage() {
  return (
    <>
      <BreadcrumbBanner
        title={"Webinars"}
        subtitle="Join our live sessions and collaborative forums where researchers and educators share insights, ideas, and innovation."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />
      {/* ---------- Header Section ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Webinars & Online Discussions
        </h1>
        <p className="mt-6 text-slate-600 max-w-3xl mx-auto leading-relaxed">
          <strong>MACROJ</strong> hosts periodic online webinars, panel talks,
          and e-discussions designed to promote{" "}
          <span className="font-semibold bg-sky-50 px-1">
            global research exchange
          </span>{" "}
          and community learning. Engage with thought leaders, explore emerging
          academic themes, and connect with peers worldwide.
        </p>
      </section>

      <Separator className="my-8" />

      {/* ---------- Upcoming Webinar ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Upcoming Live Webinar
        </h2>

        <Card className="hover:shadow-md transition max-w-4xl mx-auto rounded-none shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-semibold">
              “Ethical AI & Interdisciplinary Research: Balancing Innovation
              with Responsibility”
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sky-600" />
                <span>December 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sky-600" />
                <span>4:00 PM – 6:00 PM (IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-sky-600" />
                <span>Dr. Anjali Verma, AI Ethics Researcher, IIT Delhi</span>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              This session will explore how artificial intelligence and ethical
              research practices intersect in the modern world. Learn how
              cross-disciplinary collaboration can ensure technology benefits
              society responsibly.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button className=" flex items-center gap-2">
                <Video className="h-4 w-4" /> Join Live Session
              </Button>
              <Button variant="outline">
                Add to Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---------- Live Discussion Section ---------- */}
      {/* <section className="max-w-6xl mx-auto px-6 py-12 rounded-none shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Live Discussion Feed
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              user: "Dr. S. Mukherjee",
              comment:
                "The ethical frameworks around AI research are crucial. We must prioritize transparency and fairness in data-driven systems.",
              time: "2 mins ago",
            },
            {
              user: "Prof. R. Gupta",
              comment:
                "Interdisciplinary collaboration is the key! Philosophy, engineering, and sociology should all contribute to AI policy.",
              time: "8 mins ago",
            },
            {
              user: "Student – Priya Singh",
              comment:
                "Looking forward to the live Q&A session. Would love to hear about AI in education and inclusivity.",
              time: "15 mins ago",
            },
          ].map((chat, i) => (
            <Card
              key={i}
              className="bg-white border border-slate-200 hover:shadow-sm transition rounded-none"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {chat.user}
                  </span>
                  <span>{chat.time}</span>
                </div>
                <p className="text-slate-700 mt-2">{chat.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-6 flex items-center gap-3">
          <input
            type="text"
            placeholder="Join the discussion..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500"
          />
          <Button className="bg-emerald-700 hover:bg-emerald-800">Post</Button>
        </div>
      </section> */}

      {/* ---------- Past Webinars ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-slate-800">
          Past Webinars
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title:
                "2024 Panel Discussion: Open Access Research and Knowledge Equity",
              summary:
                "A panel of 5 distinguished academicians explored challenges and benefits of open access publishing and its role in inclusive education.",
              link: "#",
            },
            {
              title:
                "2023 Webinar: Climate Literacy & Sustainability Education",
              summary:
                "Experts from environmental science and social studies discussed integrating sustainability into mainstream higher education.",
              link: "#",
            },
          ].map((event, i) => (
            <Card
              key={i}
              className="bg-emerald-50/50 border-emerald-100 hover:shadow-md transition rounded-none"
            >
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-semibold text-emerald-900">
                  {event.title}
                </h3>
                <p className="text-slate-700">{event.summary}</p>
                <Button
                  variant="outline"
                  className="border-emerald-700 text-emerald-700"
                >
                  Watch Recording
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Engagement Section ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-white border-t border-slate-100">
        <h2 className="text-2xl font-semibold mb-6 text-center text-slate-800">
          Engage, Learn, and Collaborate
        </h2>
        <p className="text-slate-700 text-center max-w-3xl mx-auto mb-8 leading-relaxed">
          Whether you are a researcher, educator, or student, our webinars offer
          an opportunity to{" "}
          <span className="bg-amber-50 px-1 font-semibold">
            connect globally, learn continuously
          </span>
          , and contribute meaningfully to scholarly discourse. Each session is
          crafted to build bridges between disciplines and promote a culture of
          critical inquiry.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Users className="h-6 w-6 text-sky-600" />,
              title: "Global Community",
              desc: "Join hundreds of participants from different countries and academic fields.",
            },
            {
              icon: <BookOpen className="h-6 w-6 text-amber-500" />,
              title: "Expert Speakers",
              desc: "Learn from leading professors, innovators, and researchers from top institutions.",
            },
            {
              icon: <Globe className="h-6 w-6 text-emerald-600" />,
              title: "Accessible Anywhere",
              desc: "All sessions are conducted online with easy access for remote participants.",
            },
            {
              icon: <Share2 className="h-6 w-6 text-indigo-600" />,
              title: "Collaborative Dialogue",
              desc: "Engage in live discussions, share perspectives, and publish outcomes.",
            },
          ].map((v, i) => (
            <Card
              key={i}
              className="rounded-none hover:shadow-md transition"
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
