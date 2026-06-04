import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ZoomIn, ZoomOut, Loader2 } from "lucide-react";

interface CropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  uploading: boolean;
  onUpload: (zoom: number) => void;
}

export function CropDialog({ open, onOpenChange, imageSrc, uploading, onUpload }: CropDialogProps) {
  const [zoom, setZoom] = useState(1);

  const handleClose = () => {
    setZoom(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-[280px]">
        <DialogHeader>
          <DialogTitle>Crop & Upload</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3">
          <div className="w-44 h-44 rounded-full overflow-hidden border-2 border-primary bg-muted">
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Preview"
                className="w-full h-full object-cover transition-transform"
                style={{ transform: `scale(${zoom})` }}
              />
            )}
          </div>
          <div className="flex items-center gap-2 w-full px-2">
            <button onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(1)))} className="text-muted-foreground hover:text-foreground">
              <ZoomOut className="h-4 w-4" />
            </button>
            <Slider
              min={100}
              max={300}
              step={10}
              value={[zoom * 100]}
              onValueChange={([v]) => setZoom(v / 100)}
              className="flex-1"
            />
            <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(1)))} className="text-muted-foreground hover:text-foreground">
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
        <DialogFooter className="flex-row! justify-end!">
          <Button size="sm" onClick={() => onUpload(zoom)} disabled={uploading} className="gap-1">
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Upload
          </Button>
          <Button size="sm" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
