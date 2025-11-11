import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
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
    { name: "MACROJ Editorial Team", url: "https://yourdomain.com/macroj" },
  ],
  creator: "MACROJ Editorial Team",
  publisher: "MACROJ Research Journal",
  openGraph: {
    title: "Conferences & Symposia - MACROJ Research Journal",
    description:
      "Join MACROJ and Marwari College Ranchi academic conferences, workshops, and symposia to advance interdisciplinary research and network with scholars.",
    url: "https://yourdomain.com/events/conferences",
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
  metadataBase: new URL("https://yourdomain.com/"),
};

export default function Contact() {
  return (
    <section className="py-3">
      <div className="mx-auto max-w-5xl px-4 lg:px-0">
        <h1 className="mb-12 text-center text-4xl font-semibold lg:text-5xl">
          Help us route your inquiry
        </h1>

        <div className="grid divide-y border md:grid-cols-2 md:gap-4 md:divide-x md:divide-y-0">
          <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
            <div>
              <h2 className="mb-3 text-lg font-semibold">Contact</h2>
              <Link
                href="mailto:hello@tailus.io"
                className="text-lg text-blue-600 hover:underline dark:text-blue-400"
              >
                editor.macroj.marwaricollege@gmail.com
              </Link>
              {/* <p className="mt-3 text-sm">+243 000 000 000</p> */}
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Office</h3>
              <p
                // href="mailto:press@tailus.io"
                className="text-lg font-medium"
              >
                MACROJ, Marwari College Ranchi
              </p>
              {/* <p className="mt-3 text-sm">+243 000 000 000</p> */}
            </div>
          </div>
        </div>

        <div className="h-3 border-x bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]"></div>
        <form action="">
          <Card className="mx-auto p-8 sm:p-16 rounded-none">
            <h3 className="text-xl font-semibold">
              Let&apos;s get you to the right place
            </h3>
            <p className="text-sm">
              Reach out to our team!
              {/* We&apos;re eager to learn more about
              how you plan to use our application. */}
            </p>

            <div className="**:[&>label]:block mt-6 space-y-6 *:space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="space-y-2">
                  Full name
                </Label>
                <Input type="text" id="name" required />
              </div>
              <div>
                <Label htmlFor="email" className="space-y-2">
                  Email
                </Label>
                <Input type="email" id="email" required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="msg" className="space-y-2">
                  Message
                </Label>
                <Textarea id="msg" rows={3} />
              </div>
            </div>
            <Button>Submit</Button>
          </Card>
        </form>
      </div>
    </section>
  );
}
