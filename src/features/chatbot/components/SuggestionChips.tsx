import { Button } from "@/components/ui/button";

export interface SuggestionChip {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SuggestionChipsProps {
  chips: SuggestionChip[];
  onSelect: (chip: SuggestionChip) => void;
}

export function SuggestionChips({ chips, onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {chips.map((chip) => (
        <Button
          key={chip.id}
          variant="outline"
          size="sm"
          onClick={() => onSelect(chip)}
          className="rounded-full gap-1 text-[11px] sm:text-xs h-7 sm:h-8 px-2.5 sm:px-3 cursor-pointer"
        >
          {chip.icon}
          {chip.label}
        </Button>
      ))}
    </div>
  );
}
