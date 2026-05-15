import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export type CarouselButton = {
  label: string;
  link: string;
};

export type CarouselSlideStatus = "DRAFT" | "HIDE" | "SHOW";

export type CarouselSlide = {
  id?: string;
  image: string;
  title: string;
  description: string;
  buttons: CarouselButton[];
  status: CarouselSlideStatus;
  sortOrder: number;
};

export const defaultCarouselSlides: CarouselSlide[] = [
  {
    image: "https://placehold.co/1200x400/FF5733/FFFFFF",
    title: "Explore Latest Research Articles",
    description:
      "Stay up-to-date with cutting-edge studies and scholarly publications.",
    buttons: [
      { label: "View Articles", link: "#" },
      { label: "Submit Your Paper", link: "#" },
    ],
    status: "SHOW",
    sortOrder: 0,
  },
  {
    image: "https://placehold.co/1200x400/33FF57/FFFFFF",
    title: "Join Our Research Community",
    description: "Collaborate with top researchers from around the globe.",
    buttons: [{ label: "Sign Up", link: "#" }],
    status: "SHOW",
    sortOrder: 1,
  },
];

function isValidStatus(value: unknown): value is CarouselSlideStatus {
  return value === "DRAFT" || value === "HIDE" || value === "SHOW";
}

function normalizeButtons(value: unknown): CarouselButton[] | null {
  if (!Array.isArray(value)) return null;

  const buttons: CarouselButton[] = [];
  for (const button of value) {
    if (
      !button ||
      typeof button !== "object" ||
      typeof (button as { label?: unknown }).label !== "string" ||
      typeof (button as { link?: unknown }).link !== "string"
    ) {
      return null;
    }

    const label = (button as { label: string }).label.trim();
    const link = (button as { link: string }).link.trim();
    if (!label || !link) return null;

    buttons.push({ label, link });
  }

  return buttons;
}

export function validateCarouselSlides(slides: unknown): {
  ok: boolean;
  error?: string;
  value?: CarouselSlide[];
} {
  if (!Array.isArray(slides) || slides.length === 0) {
    return { ok: false, error: "At least one carousel slide is required" };
  }

  const normalized: CarouselSlide[] = [];

  for (let i = 0; i < slides.length; i++) {
    const rawSlide = slides[i] as Partial<CarouselSlide>;

    if (
      typeof rawSlide.image !== "string" ||
      typeof rawSlide.title !== "string" ||
      typeof rawSlide.description !== "string"
    ) {
      return { ok: false, error: `Slide ${i + 1} has invalid fields` };
    }

    const image = rawSlide.image.trim();
    const title = rawSlide.title.trim();
    const description = rawSlide.description.trim();
    if (!image || !title || !description) {
      return { ok: false, error: `Slide ${i + 1} has empty required fields` };
    }

    const buttons = normalizeButtons(rawSlide.buttons);
    if (!buttons) {
      return { ok: false, error: `Slide ${i + 1} has invalid buttons` };
    }

    if (buttons.length < 1 || buttons.length > 2) {
      return {
        ok: false,
        error: `Slide ${i + 1} must have between 1 and 2 buttons`,
      };
    }

    normalized.push({
      id: rawSlide.id,
      image,
      title,
      description,
      buttons,
      status: isValidStatus(rawSlide.status) ? rawSlide.status : "DRAFT",
      sortOrder:
        typeof rawSlide.sortOrder === "number" &&
        Number.isFinite(rawSlide.sortOrder)
          ? rawSlide.sortOrder
          : i,
    });
  }

  return { ok: true, value: normalized };
}

async function ensureDefaultSlidesIfEmpty() {
  const count = await prisma.carouselslide.count();
  if (count > 0) return;

  await prisma.carouselslide.createMany({
    data: defaultCarouselSlides.map((slide, index) => ({
      id: randomUUID(),
      image: slide.image,
      title: slide.title,
      description: slide.description,
      buttons: JSON.stringify(slide.buttons),
      status: slide.status,
      sortOrder: index,
    })),
  });
}

function mapDbSlide(slide: {
  id: string;
  image: string;
  title: string;
  description: string;
  buttons: string;
  status: CarouselSlideStatus;
  sortOrder: number;
}): CarouselSlide {
  let parsedButtons: unknown = [];

  try {
    parsedButtons = JSON.parse(slide.buttons);
  } catch {
    parsedButtons = [];
  }

  return {
    id: slide.id,
    image: slide.image,
    title: slide.title,
    description: slide.description,
    buttons: normalizeButtons(parsedButtons) ?? [],
    status: slide.status,
    sortOrder: slide.sortOrder,
  };
}

export async function readCarouselSlides(options?: {
  onlyVisible?: boolean;
}): Promise<CarouselSlide[]> {
  await ensureDefaultSlidesIfEmpty();

  const slides = await prisma.carouselslide.findMany({
    where: options?.onlyVisible ? { status: "SHOW" } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return slides.map(mapDbSlide).filter((slide) => slide.buttons.length > 0);
}

export async function writeCarouselSlides(slides: CarouselSlide[]) {
  await prisma.$transaction(async (tx) => {
    await tx.carouselslide.deleteMany({});
    await tx.carouselslide.createMany({
      data: slides.map((slide, index) => ({
        id: slide.id ?? randomUUID(),
        image: slide.image,
        title: slide.title,
        description: slide.description,
        buttons: JSON.stringify(slide.buttons),
        status: slide.status,
        sortOrder: index,
      })),
    });
  });
}
