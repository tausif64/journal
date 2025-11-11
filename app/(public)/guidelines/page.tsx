import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Author Guidelines - MACROJ Research Journal",
  description:
    "Submission policies, formatting instructions, and publication ethics for authors submitting manuscripts to MACROJ journal.",
  keywords: [
    "MACROJ",
    "Author Guidelines",
    "Submission Policies",
    "Manuscript Formatting",
    "Publication Ethics",
    "Academic Research",
    "Peer Review",
    "Scholarly Publishing",
    "Journal Submission",
  ],
  authors: [
    { name: "MACROJ Editorial Team", url: "https://yourdomain.com/macroj" },
  ],
  creator: "MACROJ Editorial Team",
  publisher: "MACROJ Research Journal",
  openGraph: {
    title: "Author Guidelines - MACROJ Research Journal",
    description:
      "Read MACROJ journal's author guidelines to ensure proper manuscript formatting, submission requirements, and ethical standards for academic publication.",
    url: "https://yourdomain.com/guidelines",
    siteName: "MACROJ Research Journal",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x400/FF5733/FFFFFF.png",
        width: 1200,
        height: 400,
        alt: "MACROJ Author Guidelines Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Author Guidelines - MACROJ Research Journal",
    description:
      "Follow MACROJ's author guidelines for manuscript submission, formatting instructions, and publication ethics.",
    images: ["https://placehold.co/1200x400/FF5733/FFFFFF.png"],
    creator: "@MACROJ_College",
  },
  robots: "index, follow",
  metadataBase: new URL("https://yourdomain.com/"),
};

export default function GuidelinesPage() {
  return (
    <>
      <BreadcrumbBanner
        title="Author Guidelines"
        subtitle="Submission policies, formatting instructions, and publication ethics"
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />

      <div className="container mx-auto px-3 sm:px-6 py-16">
        <p className="font-semibold mb-10 text-justify">
          Please read these guidelines carefully before submitting your
          manuscript. The following policies ensure quality, transparency, and
          academic integrity in our publication process.
        </p>

        <div className="space-y-12">
          {/* 1. Scope and Submission Requirements */}
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200 pt-0 pb-10 rounded-none gap-0">
            <CardHeader className="bg-muted/40 border-b border-border/50 py-6">
              <CardTitle className="text-2xl font-semibold">
                Scope of Submissions & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 text-base leading-relaxed">
              <p>
                The journal invites{" "}
                <strong>original, unpublished research articles</strong> across
                all academic disciplines, with a strong emphasis on{" "}
                <strong>interdisciplinary research</strong>. Submissions may
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Empirical research studies</li>
                <li>Conceptual or theoretical papers</li>
                <li>Case studies and practitioner-based research</li>
              </ul>
              <p>
                Presently, manuscripts written only in clear, grammatically
                correct English or any other Indian languages are considered.
              </p>

              <h3 className="font-semibold mt-6">
                Cover Letter (Separate File)
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Title of the manuscript</li>
                <li>Full names of all authors and their affiliations</li>
                <li>
                  Corresponding author’s full contact details (email, phone)
                </li>
                <li>ORCID-ID of all authors (if available)</li>
                <li>Up to 8 keywords</li>
                <li>Article type (e.g., empirical, conceptual, case study)</li>
              </ul>

              <h3 className="font-semibold mt-6">
                Main Manuscript (Anonymous)
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>No author-identifying information</li>
                <li>Title, abstract, and keywords included</li>
                <li>Formatted as per Section 3 below</li>
                <li>Maximum 15 pages, extendible up to 20 pages</li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* 2. Formatting Guidelines */}
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200 pt-0 pb-10 rounded-none gap-0">
            <CardHeader className="bg-muted/40 border-b border-border/50 py-6">
              <CardTitle className="text-2xl font-semibold">
                Formatting Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 text-base leading-relaxed">
              <h3 className="font-semibold">General Formatting</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Font: Times New Roman, 10 pt</li>
                <li>Line spacing: Single</li>
                <li>
                  Margins: 1 inch (top, left, right); 1.25 inches (bottom)
                </li>
                <li>
                  Paragraphs: No indentation, one blank line between paragraphs
                </li>
                <li>
                  No headers, footers, page numbers, or two-column formatting
                </li>
              </ul>

              <h3 className="font-semibold">Title and Abstract</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Title: Bold, 14 pt, Century Schoolbook, Title Case</li>
                <li>
                  Abstract: 150–200 words, 10 pt Century Schoolbook, under
                  heading <strong>ABSTRACT</strong> (bold, all caps)
                </li>
                <li>Keywords: Up to 8, italicized, separated by commas</li>
              </ul>

              <h3 className="font-semibold">Section Headings</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Major headings: Bold, ALL CAPS, 10 pt</li>
                <li>Subheadings: Bold, Upper and lower case, 10 pt</li>
              </ul>

              <h3 className="font-semibold">Preferred Section Structure</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Introduction</li>
                <li>Literature Review</li>
                <li>Methodology</li>
                <li>Results</li>
                <li>Discussion</li>
                <li>Conclusion</li>
                <li>Limitations and Future Work</li>
                <li>References</li>
                <li>(For accepted papers) About the Author(s)</li>
              </ul>

              <h3 className="font-semibold">Figures and Tables</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Insert within the manuscript where appropriate</li>
                <li>
                  Titles: Bold, 10 pt, Times New Roman, title case, centered
                </li>
                <li>Ensure readability and proper citations in text</li>
              </ul>

              <h3 className="font-semibold">References (APA 7th Edition)</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Book: Smith, J. A. (2020). <em>Research Foundations</em>.
                  Academic Press.
                </li>
                <li>
                  Journal article: Siettos, C. I., & Russo, L. (2013).
                  Mathematical modeling of infectious disease dynamics.{" "}
                  <em>Virulence, 4(4)</em>, 295–306. https://doi.org/xx.xxx/yyyy
                </li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* 3. Submission Process */}
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200 pt-0 pb-10 rounded-none gap-0">
            <CardHeader className="bg-muted/40 border-b border-border/50 py-6">
              <CardTitle className="text-2xl font-semibold">
                Submission Process
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-base leading-relaxed">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Email all documents (cover letter and manuscript) as separate
                  Word (.docx) files to{" "}
                  <strong>editor.macroj.marwaricollege@gmail.com</strong>.
                </li>
                <li>
                  The manuscript will undergo:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Editorial screening</li>
                    <li>Double-blind peer review</li>
                    <li>
                      Notification of decision (accept, revise, or reject)
                      within 6–8 weeks
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* 4. Ethical Standards + Publication Ethics */}
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200 pt-0 pb-10 rounded-none gap-0">
            <CardHeader className="bg-muted/40 border-b border-border/50 py-6">
              <CardTitle className="text-2xl font-semibold">
                Ethical Standards & Publication Ethics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8 text-base leading-relaxed">
              <p>
                Authors must ensure originality, accurate citation, and proper
                acknowledgment of all sources. Disclosure of any conflicts of
                interest or financial support is mandatory. Plagiarism,
                fabrication, or unethical conduct will result in rejection or
                retraction.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Authors’ Responsibilities */}
                <section className="border p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Authors’ Responsibilities
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Ensure submissions are original and unpublished.</li>
                    <li>Provide accurate data and proper citations.</li>
                    <li>
                      Disclose all funding sources and conflicts of interest.
                    </li>
                    <li>
                      Confirm that all authors contributed significantly and
                      approved the final manuscript.
                    </li>
                  </ul>
                </section>

                {/* Reviewers’ Responsibilities */}
                <section className="border p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Reviewers’ Responsibilities
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide objective and timely feedback.</li>
                    <li>Maintain confidentiality of reviewed materials.</li>
                    <li>Decline reviews if conflicts of interest exist.</li>
                    <li>Focus feedback on the scholarly merit of the work.</li>
                  </ul>
                </section>

                {/* Editors’ Responsibilities */}
                <section className="border p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Editors’ Responsibilities
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Ensure a fair and unbiased peer review process and
                      maintain confidentiality.
                    </li>
                    <li>
                      Make publication decisions based solely on academic merit.
                    </li>
                    <li>
                      Address allegations of misconduct promptly and
                      transparently.
                    </li>
                  </ul>
                </section>

                {/* Misconduct and Retractions */}
                <section className="border p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Misconduct and Retractions
                  </h3>
                  <p>
                    In cases of plagiarism, duplicate submission, or data
                    falsification, the journal reserves the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Reject the manuscript</li>
                    <li>Retract the published article</li>
                    <li>Notify the authors’ institution or funding body</li>
                  </ul>
                </section>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* 5. Revision & Post-Acceptance */}
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200 pt-0 pb-10 rounded-none gap-0">
            <CardHeader className="bg-muted/40 border-b border-border/50 py-6">
              <CardTitle className="text-2xl font-semibold">
                Revision, Resubmission & Post-Acceptance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-base leading-relaxed">
              <h3 className="font-semibold">Revision and Resubmission</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Submit a clean revised manuscript and a point-by-point
                  response letter addressing all reviewer comments.
                </li>
                <li>
                  Revised manuscripts are re-evaluated before final acceptance.
                </li>
              </ul>

              <h3 className="font-semibold mt-6">
                Post-Acceptance Instructions
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Final formatting must follow publication guidelines.</li>
                <li>
                  Add author names, affiliations, and 100–150 word bios under
                  “About the Author(s)”.
                </li>
                <li>Authors may request print copies for a nominal fee.</li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* 6. Contact */}
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200 pt-0 pb-10 rounded-none gap-0">
            <CardHeader className="bg-muted/40 border-b border-border/50 py-6">
              <CardTitle className="text-2xl font-semibold">
                Contact for Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-2 text-base leading-relaxed">
              <p>
                <strong>Editorial Office – MACROJ</strong> <br />
                Marwari College, Ranchi <br />
                Email:{" "}
                <a
                  href="mailto:editor.macroj.marwaricollege@gmail.com"
                  className="text-blue-600 underline"
                >
                  editor.macroj.marwaricollege@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
