"use client";

import { useState } from "react";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  className?: string;
  icon?: "phone" | "mail" | "link" | "map" | "hash" | "flag" | "linkedin" | "twitter" | "facebook" | "instagram" | "youtube" | "calendar" | "note";
  inputType?: string;
  multiline?: boolean;
  readOnly?: boolean;
};

export default function EditableField({ label, value, placeholder, onChange, className, inputType = "text", multiline = false, readOnly = false }: Props) {
  const [editing, setEditing] = useState(false);

  if (readOnly) {
    const isEmpty = !value || value.trim() === "";
    const displayText = value?.trim() || placeholder || "—";
    const contentClass = isEmpty
      ? "text-[11px] text-slate-400/80 dark:text-gray-500/80 font-normal italic"
      : "text-slate-700 dark:text-white font-medium";
    return (
      <div className={`rounded-xl bg-slate-50/50 dark:bg-gray-800/50 border border-slate-200/60 dark:border-gray-700 px-4 py-2.5 ${className || ""}`}>
        <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-gray-500 font-bold mb-0.5">{label}</div>
        <div className={contentClass}>{displayText}</div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div
        className={`relative rounded-xl bg-slate-50/50 dark:bg-gray-800/50 border border-slate-200/60 dark:border-gray-700 px-4 py-2.5 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:border-blue-200/80 dark:hover:border-blue-500/60 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-lg focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-500/20 ${className || ""}`}
        onClick={() => setEditing(true)}
      >
        <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-gray-500 font-bold mb-0.5 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">{label}</div>
        {multiline ? (
          <textarea
            rows={3}
            value={value}
            placeholder={placeholder || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            className="w-full outline-none bg-transparent resize-y text-slate-700 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-gray-500"
          />
        ) : (
          <input
            type={inputType}
            value={value}
            placeholder={placeholder || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            className="w-full outline-none bg-transparent text-slate-700 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-gray-500"
          />
        )}
      </div>
    </div>
  );
}


