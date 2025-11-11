"use client";

import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchBar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = () => {
    if (!expanded) {
      setExpanded(true);
      inputRef.current?.focus();
    } else {
      setExpanded(false);
      setQuery("");
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const related = e.relatedTarget as HTMLElement | null;
    // prevent collapse when button is clicked
    if (related === buttonRef.current) return;
    if (!query) setExpanded(false);
  };

  return (
    <div className="relative w-fit">
      {/* Search button (always visible) */}
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={cn(
          "relative z-10 p-2 outline-2 rounded-full",
          expanded && "outline-none"
        )}
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Input expands to the LEFT */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className={cn(
          "absolute -right-1 top-[55%] -translate-y-1/2 transition-all duration-300 border-2 placeholder-black/70 rounded-full py-1 outline-none bg-transparent",
          expanded
            ? "w-56 pl-4 pr-10 bg-background"
            : "w-0 pr-0 pl-0 border-transparent"
        )}
        onFocus={() => setExpanded(true)}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default SearchBar;
