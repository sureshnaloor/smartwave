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
};

export default function EditableField({ label, value, placeholder, onChange, className, inputType = "text", multiline = false }: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="group relative">
      <div 
        className={`relative rounded-xl bg-slate-50/50 border border-slate-200/60 px-4 py-2.5 transition-all duration-300 hover:bg-white hover:shadow-md hover:border-blue-200/80 focus-within:bg-white focus-within:shadow-lg focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 ${className || ""}`}
        onClick={() => setEditing(true)}
      >
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5 group-hover:text-blue-500 transition-colors duration-300">{label}</div>
        {multiline ? (
          <textarea
            rows={3}
            value={value}
            placeholder={placeholder || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            className="w-full outline-none bg-transparent resize-y text-slate-700 font-medium placeholder:text-slate-300"
          />
        ) : (
          <input
            type={inputType}
            value={value}
            placeholder={placeholder || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            className="w-full outline-none bg-transparent text-slate-700 font-medium placeholder:text-slate-300"
          />
        )}
      </div>
    </div>
  );
}


