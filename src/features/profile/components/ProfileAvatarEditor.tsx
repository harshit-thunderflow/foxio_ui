import { useState, useRef, useCallback, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Camera, Image, Trash2, X, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import { useToast } from "@/hooks/useToast";
import { updateProfileApi } from "@/services/profile";

interface ProfileAvatarEditorProps {
  currentImage: string | null;
  initials: string;
  onUpdated: () => void;
}

export function ProfileAvatarEditor({ currentImage, initials, onUpdated }: ProfileAvatarEditorProps) {
  const [sourceModal, setSourceModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { upload } = useUpload();
  const { toast } = useToast();

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleSelectFile = () => {
    setSourceModal(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setZoom(1);
      setPreviewModal(true);
    }
    e.target.value = "";
  };

  const handleCamera = async () => {
    setSourceModal(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setCameraModal(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err: any) {
      const msg = err.name === "NotAllowedError"
        ? "Camera access blocked. The host page may restrict camera in iframes."
        : "Could not access camera";
      toast(msg, "warning");
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    stopCamera();
    setCameraModal(false);
    setImageSrc(dataUrl);
    setZoom(1);
    setPreviewModal(true);
  };

  const handleDelete = async () => {
    setSourceModal(false);
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

  const handleUpload = async () => {
    if (!imageSrc) return;
    setUploading(true);
    try {
      // Crop the image using canvas based on zoom
      const croppedFile = await cropImage(imageSrc, zoom);
      const res = await upload(croppedFile);
      await updateProfileApi({ profile_image: res.url });
      toast("Profile picture updated", "success");
      setPreviewModal(false);
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
      {/* Avatar with hover overlay */}
      <div
        className="group relative w-fit cursor-pointer"
        onClick={() => !uploading && setSourceModal(true)}
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

      {/* Source Selection Modal */}
      {sourceModal && (
        <ModalOverlay onClose={() => setSourceModal(false)}>
          <div className="bg-card rounded-lg shadow-xl border border-border p-4 w-64">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">Change Photo</span>
              <button onClick={() => setSourceModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleCamera}>
                <Camera className="h-4 w-4" /> Camera
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleSelectFile}>
                <Image className="h-4 w-4" /> Select from device
              </Button>
              {currentImage && (
                <Button variant="outline" size="sm" className="justify-start gap-2 text-destructive hover:text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" /> Remove photo
                </Button>
              )}
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Camera Modal */}
      {cameraModal && (
        <ModalOverlay onClose={() => { stopCamera(); setCameraModal(false); }}>
          <div className="bg-card rounded-lg shadow-xl border border-border p-4 w-72 flex flex-col items-center gap-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold text-foreground">Take Photo</span>
              <button onClick={() => { stopCamera(); setCameraModal(false); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-primary">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
            <Button size="sm" onClick={handleCapture} className="gap-2">
              <Camera className="h-4 w-4" /> Capture
            </Button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </ModalOverlay>
      )}

      {/* Preview & Crop Modal */}
      {previewModal && imageSrc && (
        <ModalOverlay onClose={() => { setPreviewModal(false); setImageSrc(null); }}>
          <div className="bg-card rounded-lg shadow-xl border border-border p-4 w-72 flex flex-col items-center gap-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold text-foreground">Crop & Upload</span>
              <button onClick={() => { setPreviewModal(false); setImageSrc(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-primary bg-muted">
              <img
                src={imageSrc}
                alt="Preview"
                className="w-full h-full object-cover transition-transform"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setZoom((z) => Math.max(1, z - 0.1))} className="text-muted-foreground hover:text-foreground">
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-28 accent-primary"
              />
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="text-muted-foreground hover:text-foreground">
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 w-full">
              <Button size="sm" className="flex-1 gap-1" onClick={handleUpload} disabled={uploading}>
                {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                Upload
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => { setPreviewModal(false); setImageSrc(null); }}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalOverlay>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
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
