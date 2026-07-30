"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselSlide } from "@/lib/carousel-settings";


export default function Hero() {
  const fallbackSlides: CarouselSlide[] = [
    {
      image: "/uploads/carousel/carousel-1772711165467-g2xzonys0oc.jpg",
      title: "Join Our Editorial Board",
      description:
        "We are seeking experts in various fields to join our editorial team.",
      buttons: [
        { label: "Apply Now", link: "/dashboard/submit" },
        { label: "Submit Your Paper", link: "/dashboard/submit" },
      ],
      status: "SHOW",
      sortOrder: 0,
    },
    {
      image: "/uploads/carousel/carousel-1772711186601-tte8uvh7eyq.jpg",
      title: "Call for Papers: Special Issue",
      description: "Submit your research on emerging technologies for our upcoming special issue.",
      buttons: [{ label: "Sign Up", link: "/login" }, { label: "Submit Your Paper", link: "/dashboard/submit" },],
      status: "SHOW",
      sortOrder: 1,
    },
    {
      image: "/uploads/carousel/carousel-1772711165467.png",
      title: "Discover Open Access Journals",
      description:
        "Access high-quality publications without any subscription barriers.",
      buttons: [{ label: "Browse Journals", link: "#" }],
      status: "SHOW",
      sortOrder: 2,
    },
  ];
  const [heroSlides] = useState<CarouselSlide[]>(fallbackSlides);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   const loadSlides = async () => {
  //     try {
  //       const res = await fetch("/api/public/carousel", {
  //         signal: controller.signal,
  //         cache: "no-store",
  //       });
  //       if (!res.ok) return;
  //       const json = (await res.json()) as {
  //         success?: boolean;
  //         data?: CarouselSlide[];
  //       };
  //       if (json.success && Array.isArray(json.data) && json.data.length > 0) {
  //         setHeroSlides(json.data);
  //       }
  //     } catch {
  //       // keep fallback slides on fetch errors
  //     }
  //   };

  //   void loadSlides();
  //   return () => controller.abort();
  // }, []);

  // const slides = heroSlides;

  // // Clone the first slide(s) at the end for seamless looping
  // const slidesForCarousel = [...slides, ...slides.slice(0, 1)]; 

  // const [api, setApi] = useState<CarouselApi>();

  //  useEffect(() => {
  //    if (!api) return;

  //    api.on("select", () => {
  //      const current = api.selectedScrollSnap();
  //      const total = api.scrollSnapList().length;

  //      // Example: Loop back to start when reaching the end
  //      if (current === total - 1) {
  //        setTimeout(() => api.scrollTo(0, true), 500); // Smooth scroll to start
  //      }
  //    });
  //  }, [api]);


  return (
    <section className="relative w-full overflow-hidden h-[90vh] p-0">
      <Carousel
        className="w-full h-full"
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
      >
        <CarouselContent className="flex">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="min-w-full">
              <Card className="rounded-none border h-[90vh] p-0">
                <CardContent
                  className="flex items-center justify-center h-full bg-cover bg-center p-6 relative"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="relative z-10 text-center max-w-3xl px-6 bg-background/20 backdrop-blur-md rounded p-8">
                    <h2 className="text-2xl md:text-4xl font-semibold mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-base mb-6">{slide.description}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      {slide.buttons.map((btn, i) => (
                        <Button
                          key={i}
                          size="lg"
                          className="bg-primary text-white hover:bg-primary/90"
                          asChild
                        >
                          <a href={btn.link}>{btn.label}</a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-background/60 backdrop-blur-md" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-background/60 backdrop-blur-md" /> */}
      </Carousel>
    </section>
  );
}
