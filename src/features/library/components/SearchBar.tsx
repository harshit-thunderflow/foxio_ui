import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = "Search tutorials or video scripts..." }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-0 bottom-0 my-auto w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-9 sm:pl-10 h-9 sm:h-10 bg-muted/50 text-sm"
      />
    </div>
  );
}
