"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadcrumbBannerProps {
  title: string;
  subtitle?: string;
  image?: string;
  overlay?: boolean;
  className?: string;
}

export function BreadcrumbBanner({
  title,
  subtitle,
  image,
  overlay = true,
  className,
}: BreadcrumbBannerProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden border-b bg-muted/30",
        className
      )}
    >
      {/* Background Image (optional) */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover object-center"
          />
          {overlay && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Dynamic Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.map((segment, index) => {
              const href = "/" + pathSegments.slice(0, index + 1).join("/");
              const label =
                segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, " ");
              const isLast = index === pathSegments.length - 1;

              return (
                <div key={href} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title & Subtitle */}
        <h1
          className={cn(
            "text-4xl font-bold tracking-tight mt-6",
            image ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={cn(
              "mt-3 text-base max-w-2xl",
              image ? "text-gray-200" : "text-muted-foreground"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
