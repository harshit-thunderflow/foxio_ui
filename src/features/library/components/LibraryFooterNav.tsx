import { SquarePlay, ListVideo, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: SquarePlay, label: "Library", active: true },
  { icon: ListVideo, label: "Up Next" },
  { icon: BookOpen, label: "Resources" },
];

export function LibraryFooterNav() {
  return (
    <div className="shrink-0 border-t-2 border-border bg-muted/50 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] p-2.5 sm:p-3 md:p-4 space-y-1 sm:space-y-2">
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          className={`w-full justify-start gap-3 sm:gap-4 px-2 h-9 sm:h-10 ${
            item.active
              ? "bg-accent border-r-[3px] sm:border-r-4 border-primary text-primary rounded-none"
              : "text-muted-foreground"
          }`}
        >
          <item.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
          <span className="text-[11px] sm:text-xs md:text-sm font-medium">
            {item.label}
          </span>
        </Button>
      ))}

      {/* CTA Button */}
      <Button className="w-full mt-1 sm:mt-2 h-9 sm:h-10 md:h-11 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm shadow-md">
        Complete Setup
      </Button>
    </div>
  );
}
