import { Member } from "@/lib/types";
import { MemberCard } from "./_components/MemberCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Board & Members - MACROJ Research Journal",
  description:
    "Meet the editorial board, associate editors, co-editors, and reviewers of MACROJ Research Journal. Connect with experts and scholars shaping academic research.",
  keywords: [
    "MACROJ",
    "Editorial Board",
    "Editors",
    "Reviewers",
    "Academic Journal",
    "Research",
    "Scholarly Collaboration",
    "Contributing Scholars",
  ],
  authors: [
    { name: "MACROJ Editorial Team", url: "https://yourdomain.com/macroj" },
  ],
  creator: "MACROJ Editorial Team",
  publisher: "MACROJ Research Journal",
  openGraph: {
    title: "Editorial Board & Members - MACROJ Research Journal",
    description:
      "Explore the editorial board, associate editors, co-editors, and reviewers contributing to MACROJ Research Journal.",
    url: "https://yourdomain.com/members",
    siteName: "MACROJ Research Journal",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "MACROJ Editorial Board Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Board & Members - MACROJ Research Journal",
    description:
      "Meet the editorial board, associate editors, co-editors, and reviewers of MACROJ Research Journal.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
    creator: "@MACROJ_College",
  },
  robots: "index, follow",
  metadataBase: new URL("https://yourdomain.com/"),
};


const teamData: Member[] = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Frontend Developer",
    image: "/team/haan.jpg",
    linkedin: "https://linkedin.com/in/alice",
    twitter: "https://twitter.com/alice",
    github: "https://github.com/alice",
  },
  {
    id: 2,
    name: "Mark Thompson",
    role: "Backend Engineer",
    image: "/team/mark.jpg",
    linkedin: "https://linkedin.com/in/mark",
    github: "https://github.com/mark",
  },
  {
    id: 3,
    name: "Sophia Lee",
    role: "UI/UX Designer",
    image: "/team/sophia.jpg",
    linkedin: "https://linkedin.com/in/sophia",
    twitter: "https://twitter.com/sophia",
  },
  {
    id: 4,
    name: "David Kim",
    role: "DevOps Engineer",
    image: "/team/david.jpg",
    linkedin: "https://linkedin.com/in/david",
    github: "https://github.com/david",
  },
];

export default function MemberPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Meet Our Editorial Members
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Meet the editorial board, reviewers, and contributing scholars.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {teamData.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
