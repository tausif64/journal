"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SubmitBanner() {
  return (
    <section className="relative w-full mt-16 mb-10 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://placehold.co/1200x400/FF5733/FFFFFF')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative container mx-auto px-6 py-20 text-center text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Submit Your Manuscript
        </h2>
        <p className="max-w-2xl text-base md:text-lg mb-8 text-gray-100">
          Submit your manuscript to be published in the{" "}
          <span className="font-semibold">MACROJ Journal</span>. This
          opportunity will help you share your research with a broader audience
          and advance your academic career.
        </p>
        <Link href="/submit">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-base font-semibold shadow-md"
          >
            Submit Paper
          </Button>
        </Link>
      </div>
    </section>
  );
}
