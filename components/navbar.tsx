"use client";

import React from "react";
import {
  Book,
  Menu,
  Users,
  Target,
  Eye,
  FileText,
  Library,
  Archive,
  Video,
  MessageSquare,
  Calendar,
  ChevronDown,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
}

const menu: MenuItem[] = [
  {
    title: "About",
    url: "#",
    items: [
      {
        title: "About Us",
        description:
          "Learn about our journal, history, and academic community.",
        icon: <Book className="size-5 shrink-0" />,
        url: "/about-us",
      },
      {
        title: "Mission",
        description:
          "Our commitment to advancing scholarly publishing and research.",
        icon: <Target className="size-5 shrink-0" />,
        url: "/mission-vision#mission",
      },
      {
        title: "Vision",
        description:
          "Discover our vision for academic excellence and innovation.",
        icon: <Eye className="size-5 shrink-0" />,
        url: "/mission-vision#vision",
      },
      {
        title: "Editorial Members",
        description:
          "Meet the editorial board, reviewers, and contributing scholars.",
        icon: <Users className="size-5 shrink-0" />,
        url: "/members",
      },
    ],
  },
  {
    title: "Publications",
    url: "#",
    items: [
      {
        title: "Articles",
        description:
          "Access peer-reviewed articles from diverse research disciplines.",
        icon: <FileText className="size-5 shrink-0" />,
        url: "/publications/articles",
      },
      {
        title: "Journals",
        description: "Browse our academic journals and explore current issues.",
        icon: <Library className="size-5 shrink-0" />,
        url: "/publications/journals",
      },
      {
        title: "Books",
        description:
          "Explore scholarly books and monographs from leading researchers.",
        icon: <Book className="size-5 shrink-0" />,
        url: "/publications/books",
      },
    ],
  },
  {
    title: "Archives",
    url: "#",
    items: [
      {
        title: "Past Issues",
        description: "Explore previous journal volumes and special issues.",
        icon: <Archive className="size-5 shrink-0" />,
        url: "/archives/issues",
      },
      {
        title: "Video Resources",
        description:
          "Watch recorded lectures, conferences, and research presentations.",
        icon: <Video className="size-5 shrink-0" />,
        url: "/archives/videos",
      },
      {
        title: "Research Discussions",
        description:
          "Join academic conversations and debates within your field.",
        icon: <MessageSquare className="size-5 shrink-0" />,
        url: "/archives/discussions",
      },
    ],
  },
  {
    title: "Events",
    url: "#",
    items: [
      {
        title: "Conferences",
        description: "Upcoming and past academic conferences and symposia.",
        icon: <Calendar className="size-5 shrink-0" />,
        url: "/events/conferences",
      },
      {
        title: "Workshops",
        description:
          "Hands-on training and workshops for researchers and students.",
        icon: <Book className="size-5 shrink-0" />,
        url: "/events/workshops",
      },
      {
        title: "Webinars",
        description:
          "Engage in live sessions and online discussions with experts.",
        icon: <Video className="size-5 shrink-0" />,
        url: "/events/webinars",
      },
    ],
  },
  {
    title: "Guidelines",
    url: "/guidelines",
  },
  {
    title: "Contact us",
    url: "/contact",
  },
];

const Navbar: React.FC<NavbarProps> = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "MACROJ",
  },
}) => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md py-4">
      <div className="container mx-auto flex items-center justify-between px-3">
        {/* Logo */}
        <Link href={logo.url} className="flex flex-col">
          {/* <Image
            src={logo.src}
            className="max-h-8 dark:invert"
            width={32}
            height={32}
            alt={logo.alt}
          /> */}
          <span className="text-xl font-bold tracking-tighter">
            {logo.title}
          </span>
          <span className="text-[12px] font-medium -mt-1">ISSN: 2249-0825</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6 lg:gap-x-10 relative">
          {menu.map((item) =>
            item.items ? (
              <div key={item.title} className="group relative">
                <button className="flex items-center gap-1 font-semibold text-sm hover:text-primary transition">
                  {item.title}
                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                </button>
                {/* Dropdown */}
                <div className="invisible absolute left-0 top-full mt-2 w-80 rounded-md border bg-background p-3 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.url}
                      className="flex items-start gap-3 rounded-md p-2 text-sm hover:bg-muted"
                    >
                      <div className="text-foreground">{subItem.icon}</div>
                      <div>
                        <div className="font-semibold">{subItem.title}</div>
                        <p className="text-muted-foreground text-xs leading-snug">
                          {subItem.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.title}
                href={item.url}
                className="font-semibold text-sm hover:text-primary transition"
              >
                {item.title}
              </Link>
            )
          )}
          <Button asChild className="rounded-full">
            <a href={"/login"}>Publish with us</a>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden ">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href={logo.url} className="flex items-center gap-2">
                    <Image
                      src={logo.src}
                      className="max-h-8 dark:invert"
                      width={32}
                      height={30}
                      alt={logo.alt}
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                <Accordion type="single" collapsible>
                  {menu.map((item) => (
                    <React.Fragment key={item.title}>
                      {renderMobileMenuItem(item)}
                    </React.Fragment>
                  ))}
                </Accordion>
              </div>
              <div className="flex flex-col gap-2 items-center px-2">
                <Button asChild className="rounded flex-1 w-full">
                  <a href={"/login"}>Publish with us</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

/* ---------- Subcomponents ---------- */

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title}>
        <AccordionTrigger className="text-md font-semibold">
          {item.title}
        </AccordionTrigger>
        <AccordionContent>
          {item.items.map((subItem) => (
            <Link
              key={subItem.title}
              href={subItem.url}
              className="flex items-start gap-3 rounded-md p-2 text-sm hover:bg-muted"
            >
              {subItem.icon}
              <div>
                <div className="font-semibold">{subItem.title}</div>
                <p className="text-muted-foreground text-xs leading-snug">
                  {subItem.description}
                </p>
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <div className="h-10 mt-2.5 hover:underline border-b border-border py-2">
      <Link key={item.title} href={item.url} className="text-md font-semibold">
        {item.title}
      </Link>
    </div>
  );
};

export { Navbar };
