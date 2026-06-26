"use client";

import { DropDownMenuProps } from "@/app/types/UI";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const DropDownMenu = ({ option, onChange, optionList }: DropDownMenuProps) => {
  const [selected, setSelected] = useState(option);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSelected(option); }, [option]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-44 text-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
      >
        <span className="truncate">{selected}</span>
        <ChevronDown size={14} className={`transition-transform shrink-0 ml-2 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute mt-1.5 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden z-20">
          {optionList.map((item) => {
            const isActive = selected === item;
            return (
              <button
                key={item}
                onClick={() => { setSelected(item); onChange(item); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item}
                {isActive && <Check size={13} className="text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
