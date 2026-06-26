"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileJson, FileText, File } from "lucide-react";
import { ExportBTNProps } from "@/app/types/UI";

const ExportBTN = ({ id, title, exportToJSON, exportToPDF, exportToCSV }: ExportBTNProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // The type signature requires (roadmapId, roadmapTitle) — pass them from props
  const options = [
    { label: "Export as JSON", icon: FileJson, action: () => exportToJSON(id, title) },
    { label: "Export as PDF",  icon: FileText, action: () => exportToPDF(id, title) },
    { label: "Export as CSV",  icon: File,     action: () => exportToCSV(id, title) },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary text-xs px-3 py-2 rounded-lg gap-1.5"
      >
        <Download size={13} />
        Export
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 w-44 rounded-xl border border-border bg-card shadow-xl z-20 overflow-hidden">
          {options.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={() => { action(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Icon size={14} className="text-primary" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportBTN;
