import AboutContent from "@/components/about-content";
import Banner from "@/components/banner";
import { FAQ } from "@/components/faq";
import Hero from "@/components/hero";
import { PublicationTimeline } from "@/components/publication-timeline";
import TestimonialCarousel from "@/components/testimonial-carousel";
import WhyPublish from "@/components/why-publish";
import { Metadata } from "next";

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

export default function Home() {
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
