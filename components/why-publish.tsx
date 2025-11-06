"use client";

export default function WhyPublish() {
  return (
    <section className="container mx-auto px-6 py-16 border-2">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left Column - Intro Text */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Publish in <span className="text-primary">MACROJ</span>
          </h2>
          <p className="text-base md:text-lg text-gray-700">
            Why to Publish in MACROJ: An UGC-Compliant International Research
            Journal. Manuscript submission to an UGC-Compliant International
            Research Journal allows for quick publication, ensuring timely
            dissemination of findings. Open access journals provide unrestricted
            access to published research, promoting knowledge sharing and
            collaboration. Scholars often seek high-impact factor journals for
            wider visibility and recognition of their work. With the increasing
            demand for quick publishing, researchers look for the best journals
            to publish their research papers.
          </p>
        </div>

        {/* Right Column - Image with overlay text */}
        <div className="relative w-full h-96 md:h-auto rounded-lg overflow-hidden shadow-lg">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://placehold.co/1200x400/0057B7/FFFFFF')",
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Overlay Text */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Benefits of Publishing in MACROJ
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
              <li>HD Print-ready Certificates</li>
              <li>Signed Acceptance Letter</li>
              <li>High Impact Factor Journal</li>
              <li>Best Journal to Publish Research Paper</li>
              <li>Quick Publishing Journal</li>
              <li>Conference for Paper Publication 2024</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
