"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Banner: React.FC = () => {

  return (
    <section
      style={{ background: "linear-gradient(60deg, #4A6572 50%, #344955 50%)" }}
      className="w-full h-[350px] flex flex-col md:flex-row max-lg:gap-0 items-center justify-center relative overflow-hidden mb-10"
    >
      <div className="md:flex-1 flex flex-col justify-center items-center text-white text-center font-semibold container mx-auto px-6 text-[2rem] h-full max-h-[200px]">
        {" "}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Submit Your Manuscript
        </h2>
        <p className="max-w-2xl text-base mb-8 text-gray-100">
          Submit your manuscript to be published in the{" "}
          <span className="font-semibold">MACROJ Journal</span>. This
          opportunity will help you share your research with a broader audience
          and advance your academic career.
        </p>
        {/* <div className="relative  py-20 text-center text-white flex flex-col items-center justify-center">
        </div> */}
      </div>
      <div className="md:flex-1 flex justify-center items-center relative">
        <Link href="/login">
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
};

export default Banner;
