import { ChevronDown, ChevronRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface VideoFooterProps {
  tipTitle?: string;
  tipDescription?: string;
  currentVideoIndex: number;
  language: "en" | "hi";
  onLanguageChange: (lang: "en" | "hi") => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  hi: "Hindi",
};

export function VideoFooter({
  tipTitle = "Pro Tip",
  tipDescription = "Use keyboard shortcuts for faster navigation.",
  currentVideoIndex,
  language,
  onLanguageChange,
}: VideoFooterProps) {
  const isFirstVideo = currentVideoIndex === 0;
  const languages = isFirstVideo ? ["en", "hi"] as const : ["en"] as const;

  return (
    <div className="border-t border-border/50 p-3 sm:p-4 space-y-2">
      {/* Language Selector */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">Language</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 text-[11px] sm:text-xs h-7 sm:h-8">
              {LANGUAGE_LABELS[isFirstVideo ? language : "en"]}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem key={lang} onClick={() => onLanguageChange(lang)} className="cursor-pointer hover:bg-accent">
                {LANGUAGE_LABELS[lang]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tip Banner */}
      <Card className="flex-row items-center gap-2 p-2 bg-muted/50 ring-border shadow-none">
        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs font-bold text-primary">{tipTitle}</p>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground">{tipDescription}</p>
        </div>
        <Button variant="ghost" size="icon-xs" className="shrink-0">
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
        </Button>
      </Card>
    </div>
  );
}
