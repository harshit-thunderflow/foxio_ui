import { Check, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ChecklistItem {
  id: string;
  text: string;
  status: "done" | "active" | "pending";
}

interface ChecklistProps {
  title: string;
  items: ChecklistItem[];
}

export function Checklist({ title, items }: ChecklistProps) {
  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="space-y-3 sm:space-y-4 max-w-2xl w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        <Badge variant="secondary" className="bg-accent text-primary text-xs sm:text-[13px]">
          {doneCount}/{items.length}
        </Badge>
      </div>

      <div className="grid gap-1.5 sm:gap-2">
        {items.map((item) => (
          <Card
            key={item.id}
            size="sm"
            className={`flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl ${
              item.status === "active"
                ? "bg-card/60 ring-primary/20 shadow-sm"
                : item.status === "done"
                ? "bg-card/40 ring-border/20"
                : "bg-card/30 ring-border/10"
            }`}
          >
            {/* Checkbox */}
            {item.status === "done" ? (
              <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-primary border-2 border-primary flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2 sm:w-3 sm:h-2.5 text-primary-foreground" />
              </div>
            ) : item.status === "active" ? (
              <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-background border-2 border-primary flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm bg-primary" />
              </div>
            ) : (
              <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-background border-2 border-muted-foreground/40 shrink-0" />
            )}

            {/* Text */}
            <span
              className={`text-sm sm:text-base flex-1 ${
                item.status === "done"
                  ? "line-through opacity-60 text-foreground"
                  : item.status === "active"
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.text}
            </span>

            {item.status === "active" && (
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
