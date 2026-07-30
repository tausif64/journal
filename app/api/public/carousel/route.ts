import { NextResponse } from "next/server";
import { readCarouselSlides } from "@/lib/carousel-settings";

export async function GET() {
  const slides = await readCarouselSlides({ onlyVisible: true });
  return NextResponse.json({ success: true, data: slides });
}
