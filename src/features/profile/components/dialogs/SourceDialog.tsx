import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Image, Trash2 } from "lucide-react";

interface SourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasImage: boolean;
  onCamera: () => void;
  onSelect: () => void;
  onDelete: () => void;
}

export function SourceDialog({ open, onOpenChange, hasImage, onCamera, onSelect, onDelete }: SourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[250px]">
        <DialogHeader>
          <DialogTitle>Change Photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="justify-start gap-2" onClick={onCamera}>
            <Camera className="h-4 w-4" /> Camera
          </Button>
          <Button variant="outline" size="sm" className="justify-start gap-2" onClick={onSelect}>
            <Image className="h-4 w-4" /> Select from device
          </Button>
          {hasImage && (
            <Button variant="outline" size="sm" className="justify-start gap-2 text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" /> Remove photo
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
