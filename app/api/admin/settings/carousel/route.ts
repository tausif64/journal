import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import {
  readCarouselSlides,
  validateCarouselSlides,
  writeCarouselSlides,
} from "@/lib/carousel-settings";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const slides = await readCarouselSlides();
  return NextResponse.json({ success: true, data: slides });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const payload = body as { slides?: unknown };
  const validated = validateCarouselSlides(payload.slides);
  if (!validated.ok || !validated.value) {
    return NextResponse.json(
      { success: false, error: validated.error ?? "Invalid carousel data" },
      { status: 400 }
    );
  }

  await writeCarouselSlides(validated.value);
  return NextResponse.json({ success: true, data: validated.value });
}
