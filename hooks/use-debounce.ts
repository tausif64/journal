// hooks/use-debounce.ts
"use client";

import { useEffect, useState } from "react";

/**
 * Simple debounce hook.
 * Returns a debounced version of `value` that only updates
 * after `delay` ms of no changes.
 */
export function useDebounce<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}
