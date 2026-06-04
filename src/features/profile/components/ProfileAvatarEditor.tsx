import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Loader2 } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import { useToast } from "@/hooks/useToast";
import { updateProfileApi } from "@/services/profile";
import { SourceDialog, CameraDialog, CropDialog } from "./dialogs";

interface ProfileAvatarEditorProps {
  currentImage: string | null;
  initials: string;
  onUpdated: () => void;
}

export function ProfileAvatarEditor({ currentImage, initials, onUpdated }: ProfileAvatarEditorProps) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useUpload();
  const { toast } = useToast();

  const handleSelectFile = () => {
    setSourceOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setCropOpen(true);
    }
    e.target.value = "";
  };

  const handleCamera = () => {
    setSourceOpen(false);
    setCameraOpen(true);
  };

  const handleCapture = (dataUrl: string) => {
    setCameraOpen(false);
    setImageSrc(dataUrl);
    setCropOpen(true);
  };

  const handleDelete = async () => {
    setSourceOpen(false);
    setUploading(true);
    try {
      await updateProfileApi({ profile_image: "" });
      toast("Profile picture removed", "success");
      onUpdated();
    } catch (err: any) {
      toast(err.message || "Failed to remove picture", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (zoom: number) => {
    if (!imageSrc) return;
    setUploading(true);
    try {
      const croppedFile = await cropImage(imageSrc, zoom);
      const res = await upload(croppedFile);
      await updateProfileApi({ profile_image: res.url });
      toast("Profile picture updated", "success");
      setCropOpen(false);
      setImageSrc(null);
      onUpdated();
    } catch (err: any) {
      toast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div
        className="group relative w-fit cursor-pointer"
        onClick={() => !uploading && setSourceOpen(true)}
      >
        <Avatar size="lg" className="h-16 w-16 border-2 border-primary">
          {currentImage ? <AvatarImage src={currentImage} alt="Profile" /> : null}
          <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
        </Avatar>
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      <SourceDialog
        open={sourceOpen}
        onOpenChange={setSourceOpen}
        hasImage={!!currentImage}
        onCamera={handleCamera}
        onSelect={handleSelectFile}
        onDelete={handleDelete}
      />

      <CameraDialog
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleCapture}
      />

      <CropDialog
        open={cropOpen}
        onOpenChange={(open) => { if (!open) { setCropOpen(false); setImageSrc(null); } }}
        imageSrc={imageSrc}
        uploading={uploading}
        onUpload={handleUpload}
      />

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </>
  );
}

async function cropImage(src: string, zoom: number): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const cropSize = size / zoom;
      const offsetX = (img.width - cropSize) / 2;
      const offsetY = (img.height - cropSize) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, offsetX, offsetY, cropSize, cropSize, 0, 0, 400, 400);

      canvas.toBlob((blob) => {
        resolve(new File([blob!], "profile.png", { type: "image/png" }));
      }, "image/png");
    };
    img.src = src;
  });
}
