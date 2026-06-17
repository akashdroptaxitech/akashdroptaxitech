"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PlaceSuggestion } from "@/lib/google-maps";

export type { PlaceSuggestion };

interface LocationAutocompleteProps {
  id?: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: PlaceSuggestion) => void;
  required?: boolean;
}

export function LocationAutocomplete({
  id,
  label,
  value,
  placeholder,
  onChange,
  onSelect,
  required,
}: LocationAutocompleteProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;

  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(query.trim())}`,
      );
      const data = (await res.json()) as { suggestions?: PlaceSuggestion[] };
      const next = data.suggestions ?? [];
      setSuggestions(next);
      setOpen(next.length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(next: string) {
    onChange(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(next);
    }, 300);
  }

  function pickSuggestion(suggestion: PlaceSuggestion) {
    onChange(suggestion.description);
    onSelect?.(suggestion);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      pickSuggestion(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={inputId} className="mb-1 block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
        />
        {loading && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            ...
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.placeId} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickSuggestion(suggestion)}
                className={`w-full px-3.5 py-2.5 text-left text-sm transition hover:bg-amber-50 ${
                  index === activeIndex ? "bg-amber-50" : ""
                }`}
              >
                <span className="block font-medium text-slate-900">{suggestion.mainText}</span>
                {suggestion.secondaryText && (
                  <span className="block text-xs text-gray-500">{suggestion.secondaryText}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
