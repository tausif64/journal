"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "Submission & Screening",
    description:
      "Authors submit their manuscript and cover letter. The editorial team screens for originality, scope, and formatting compliance.",
  },
  {
    title: "Peer Review (Double-Blind)",
    description:
      "Qualified reviewers evaluate the manuscript’s scholarly quality, methodology, and contribution to the field.",
  },
  {
    title: "Revision & Decision",
    description:
      "Authors revise based on feedback and resubmit. Editors assess revisions and make the final publication decision.",
  },
  {
    title: "Publication & Indexing",
    description:
      "Accepted manuscripts undergo final formatting and are published online and in print with indexing support.",
  },
];

export function PublicationTimeline() {
  return (
    <section className="w-full py-12">
      <h2 className="text-3xl font-semibold text-center mb-12">
        Publication Process Timeline
      </h2>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between md:justify-evenly gap-10 md:gap-0 px-5">
        {/* Connecting line (horizontal on md+, vertical on mobile) */}
        <div className="absolute md:top-[42px] md:left-0 md:w-full md:h-[3px] md:bg-border/40 top-0 left-3.5 w-[3px] h-full bg-border/40"></div>

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="relative flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-0 md:w-1/4"
          >
            {/* Dot */}
            <div className="relative z-10 shrink-0 w-6 h-6 rounded-full bg-primary border-4 border-background" />

            {/* Card */}
            <Card className="w-full md:w-[90%] h-auto md:h-[230px] lg:h-[200px] border border-border/60 shadow-sm gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="m-0 py-0">
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>

            {/* Connector line to next dot */}
            {idx < steps.length - 1 && (
              <>
                {/* Horizontal line for md+ */}
                <div className="hidden md:block absolute top-2.5 left-1/2 w-full h-[3px] bg-black z-0"></div>
                {/* Vertical line for mobile */}
                <div className="md:hidden absolute top-6 left-2.5 w-[3px] h-full bg-black z-0"></div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
