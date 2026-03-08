"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface TestimonialItem {
  id: string;
  quote: string;
  designation?: string | null;
  imageUrl?: string | null;
  user: {
    name: string | null;
    image: string | null;
  };
}

const fallbackTestimonials: TestimonialItem[] = [
  {
    id: "fallback-1",
    quote: "Publishing with MACROJ transformed my research visibility!",
    designation: "Associate Professor",
    imageUrl: "https://placehold.co/100x100/FF5733/FFFFFF?text=PS",
    user: { name: "Dr. Priya Singh", image: null },
  },
  {
    id: "fallback-2",
    quote: "The review process was smooth and efficient.",
    designation: "Researcher",
    imageUrl: "https://placehold.co/100x100/007BFF/FFFFFF?text=RK",
    user: { name: "Dr. Rohit Kumar", image: null },
  },
];

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(fallbackTestimonials);

  useEffect(() => {
    const controller = new AbortController();

    const loadTestimonials = async () => {
      try {
        const res = await fetch("/api/public/testimonials", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) return;

        const json = (await res.json()) as {
          success?: boolean;
          data?: TestimonialItem[];
        };

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setTestimonials(json.data);
        }
      } catch {
        // keep fallback testimonials
      }
    };

    void loadTestimonials();
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-12 pt-10">
      <h2 className="text-3xl font-bold text-center">What Our Researchers Say</h2>

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
        <CarouselContent>
          {testimonials.map((t) => {
            const name = t.user?.name ?? "Researcher";
            const role = t.designation ?? "Author";
            const image = t.imageUrl || t.user?.image || "";
            return (
              <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/4">
                <Card className="max-w-[300px] h-[220px] gap-3 p-4 flex flex-col items-center text-center">
                  <Avatar>
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="mt-2 text-gray-700 text-sm">{t.quote}</p>
                  <p className="mt-2 font-semibold">{name}</p>
                  <p className="text-sm text-gray-500">{role}</p>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
