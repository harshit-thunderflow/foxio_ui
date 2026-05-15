import { Button } from "@/components/ui/button";

interface CategoryPillsProps {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}

export function CategoryPills({ categories, active, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={active === cat ? "default" : "secondary"}
          size="xs"
          onClick={() => onSelect(cat)}
          className="shrink-0 rounded-full px-2 sm:px-3 text-[10px] sm:text-[11px] font-bold tracking-wider"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
