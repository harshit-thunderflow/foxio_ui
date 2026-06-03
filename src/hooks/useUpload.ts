import { useState } from "react";
import { uploadFileApi, type UploadResponse } from "@/services/upload";

export function useUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, type = "profile_picture"): Promise<UploadResponse> => {
    setUploading(true);
    try {
      return await uploadFileApi(file, type);
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
