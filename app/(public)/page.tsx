import AboutContent from "@/components/about-content";
import Banner from "@/components/banner";
import { FAQ } from "@/components/faq";
import Hero from "@/components/hero";
import { PublicationTimeline } from "@/components/publication-timeline";
// import { SubmitBanner } from "@/components/submit-banner";
import TestimonialCarousel from "@/components/testimonial-carousel";
import WhyPublish from "@/components/why-publish";

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
      {/* <SubmitBanner /> */}
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
