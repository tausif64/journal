import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface AboutContentProps {
  title: string;
  description: string;
  image: string;
  desc2?: string;
}

export default function AboutContent({
  title,
  description,
  image,
  desc2,
}: AboutContentProps) {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          {title}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src={image}
                className="rounded-[15px] h-full w-full object-cover"
                alt={image}
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <blockquote className="border-l-4 pl-4">
              {/* <p>
                  Using TailsUI has been like unlocking a secret design
                  superpower. It&apos;s the perfect fusion of simplicity and
                  versatility, enabling us to create UIs that are as stunning as
                  they are user-friendly.
                </p> */}

              <div className=" space-y-3 text-justify">{description}</div>
            </blockquote>
            {desc2 && (
              <blockquote className="border-l-4 pl-4">
                {/* <p>
                  Using TailsUI has been like unlocking a secret design
                  superpower. It&apos;s the perfect fusion of simplicity and
                  versatility, enabling us to create UIs that are as stunning as
                  they are user-friendly.
                </p> */}

                <div className="mt-6 space-y-3 text-justify">{desc2}</div>
              </blockquote>
            )}
            <Link
              href="/about"
              className={buttonVariants({
                className: "ml-5",
              })}
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
