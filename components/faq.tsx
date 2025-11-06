"use client";

import { useState } from "react";
import { BookOpen, ChevronsDown } from "lucide-react";

const faqs = [
  {
    question: "What types of manuscripts can I submit?",
    answer:
      "MACROJ accepts original research articles, review articles, conceptual papers, and case studies across all academic disciplines, with a strong focus on interdisciplinary research.",
  },
  {
    question: "What is the maximum length of a manuscript?",
    answer:
      "Manuscripts should be a maximum of 15 pages, extendable up to 20 pages, including references, figures, and tables.",
  },
  {
    question: "Which languages are accepted?",
    answer:
      "Currently, manuscripts written in clear, grammatically correct English or any other Indian language are accepted.",
  },
  {
    question: "Do I need to submit a cover letter?",
    answer:
      "Yes. A cover letter is required with title, authors' names, affiliations, ORCID IDs, keywords, and article type.",
  },
  {
    question: "Is there a plagiarism check?",
    answer:
      "Yes, all manuscripts are screened for originality and plagiarism before peer review.",
  },
  {
    question: "How long does the review process take?",
    answer:
      "The double-blind peer review process typically takes 6–8 weeks, after editorial screening.",
  },
  {
    question: "Can I suggest reviewers for my paper?",
    answer:
      "Yes, authors may optionally suggest up to three potential reviewers in their cover letter.",
  },
  {
    question: "Are there publication ethics guidelines?",
    answer:
      "Absolutely. Authors, reviewers, and editors must adhere to strict ethical standards to ensure credibility and transparency.",
  },
  {
    question: "What happens if revisions are requested?",
    answer:
      "You will submit a clean revised manuscript along with a response letter addressing reviewer comments point-by-point.",
  },
  {
    question: "Do authors receive certificates or acceptance letters?",
    answer:
      "Yes. Authors receive HD print-ready certificates and a signed acceptance letter upon publication.",
  },
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h2>
      <div className="grid gap-6 md:grid-cols-1">
        {faqs.map((faq, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={index}
              className={`flex border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                isActive ? "bg-gray-50 shadow-lg" : "bg-white"
              }`}
            >
              {/* Colored Accent Bar */}
              <div
                className={`w-2 ${
                  isActive ? "bg-primary" : "bg-gray-300"
                } transition-colors duration-300`}
              ></div>

              {/* FAQ Content */}
              <div className="flex-1">
                <button
                  className="w-full flex items-center p-5 space-x-4 hover:bg-gray-50 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-800 flex-1 text-left">
                    {faq.question}
                  </span>
                  <ChevronsDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                      isActive ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 px-5 overflow-hidden border-t border-gray-100 ${
                    isActive ? "max-h-96 py-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
