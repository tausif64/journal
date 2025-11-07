"use client";
// TestimonialCarousel.tsx

import { Card } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
}

// Base testimonials
const testimonials: Testimonial[] = [
  {
    quote: "Publishing with MACROJ transformed my research visibility!",
    name: "Dr. Priya Singh",
    role: "Associate Professor",
    imageUrl: "https://placehold.co/100x100/FF5733/FFFFFF?text=PS",
  },
  {
    quote: "The review process was smooth and efficient.",
    name: "Dr. Rohit Kumar",
    role: "Researcher",
    imageUrl: "https://placehold.co/100x100/007BFF/FFFFFF?text=RK",
  },
  {
    quote: "Getting HD print-ready certificates added credibility to my work.",
    name: "Dr. Anjali Mehta",
    role: "Lecturer",
    imageUrl: "https://placehold.co/100x100/28A745/FFFFFF?text=AM",
  },
  {
    quote: "Quick publication and open access made my research widely visible.",
    name: "Dr. Sanjay Verma",
    role: "Assistant Professor",
    imageUrl: "https://placehold.co/100x100/FFC107/FFFFFF?text=SV",
  },
  {
    quote: "The platform helped me reach a global audience with my work.",
    name: "Dr. Kavita Reddy",
    role: "Senior Researcher",
    imageUrl: "https://placehold.co/100x100/6F42C1/FFFFFF?text=KR",
  },
  {
    quote: "Excellent support during the submission process. Highly recommend!",
    name: "Dr. Arjun Desai",
    role: "Postdoctoral Fellow",
    imageUrl: "https://placehold.co/100x100/17A2B8/FFFFFF?text=AD",
  },
  {
    quote:
      "I appreciated the professional formatting and layout of my article.",
    name: "Dr. Meera Joshi",
    role: "Assistant Lecturer",
    imageUrl: "https://placehold.co/100x100/FFC0CB/FFFFFF?text=MJ",
  },
  {
    quote: "The open-access model significantly increased my citation count.",
    name: "Dr. Sameer Bhatia",
    role: "Research Scientist",
    imageUrl: "https://placehold.co/100x100/28A745/FFFFFF?text=SB",
  },
  {
    quote: "Their peer-review feedback was constructive and fast.",
    name: "Dr. Nisha Kapoor",
    role: "Lecturer",
    imageUrl: "https://placehold.co/100x100/FF5733/FFFFFF?text=NK",
  },
  {
    quote: "MACROJ's editorial team is incredibly supportive and responsive.",
    name: "Dr. Rohan Iyer",
    role: "Associate Professor",
    imageUrl: "https://placehold.co/100x100/007BFF/FFFFFF?text=RI",
  },
  {
    quote: "The online submission system is intuitive and easy to use.",
    name: "Dr. Tanya Sen",
    role: "PhD Candidate",
    imageUrl: "https://placehold.co/100x100/FFC107/FFFFFF?text=TS",
  },
  {
    quote: "I highly value the visibility and credibility it gives to my work.",
    name: "Dr. Vikram Malhotra",
    role: "Senior Lecturer",
    imageUrl: "https://placehold.co/100x100/6F42C1/FFFFFF?text=VM",
  },
];

export default function TestimonialCarousel() {
  const renderCards = () =>
    testimonials.map((t, idx) => (
      <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/4">
        <Card className="max-w-[300px] h-[220px] gap-3 p-4 flex flex-col items-center text-center">
          <Avatar>
            <AvatarImage src={t.imageUrl} alt={t.name} />
            <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="mt-2 text-gray-700 text-sm">{t.quote}</p>
          <p className="mt-2 font-semibold">{t.name}</p>
          <p className="text-sm text-gray-500">{t.role}</p>
        </Card>
      </CarouselItem>
    ));

  return (
    <div className="space-y-12 pt-10">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center">
        What Our Researchers Say
      </h2>

      {/* Left-to-Right Carousel (LTR) */}
      <Carousel
        className="container mx-auto"
        opts={{
          loop: true,
          direction: "ltr",
          align: "start",
          containScroll: "trimSnaps",
          duration: 1500,
        }}
        plugins={[
          Autoplay({
            delay: 1500,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
        orientation="horizontal"
      >
        <CarouselContent>{renderCards()}</CarouselContent>
      </Carousel>
    </div>
  );
}
