"use client";
import { adminTabs } from "@/app/data";
import { adminTypeProps } from "@/app/types/admin";
import { AdminTabsProps } from "@/app/types/UI";

const AdminTabs = ({ currentTab, setCurrentTab }: AdminTabsProps) => {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-xl border border-border w-fit">
      {adminTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id as adminTypeProps)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
              isActive
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={14} className={isActive ? "text-primary" : ""} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AdminTabs;
