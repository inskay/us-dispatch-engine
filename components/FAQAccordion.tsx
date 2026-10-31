'use client';

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FAQItem = { q: string; a: string };

export function FAQAccordion({
  items,
  accentColor,
}: {
  items: FAQItem[];
  accentColor: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all hover:border-slate-300"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/80 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">
                {item.q}
              </span>
              <span className="shrink-0 p-1 rounded-md bg-slate-100 text-slate-600">
                {isOpen ? (
                  <ChevronUp className={`w-4 h-4 ${accentColor}`} />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
