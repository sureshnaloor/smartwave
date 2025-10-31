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
    <div className="group">
      <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">{label}</div>
      <div
        className={`relative border rounded-md px-3 py-2 bg-white hover:border-blue-300 focus-within:border-blue-500 transition ${className || ""}`}
        onClick={() => setEditing(true)}
      >
        {multiline ? (
          <textarea
            rows={3}
            value={value}
            placeholder={placeholder || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            className="w-full outline-none bg-transparent resize-y"
          />
        ) : (
          <input
            type={inputType}
            value={value}
            placeholder={placeholder || ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            className="w-full outline-none bg-transparent"
          />
        )}
      </div>
    </div>
  );
}


