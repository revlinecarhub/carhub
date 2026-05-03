"use client";

import { useState } from "react";
import { toast } from "sonner";

export type VideoValue = {
  url: string | null;
  public_id: string | null;
};

type SignResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  uploadPreset: string;
};

export function VideoUploader({
  value,
  onChange,
  onUploadingChange,
  onUploadOrphaned,
  initialPublicId = null,
}: {
  value: VideoValue;
  onChange: (next: VideoValue) => void;
  onUploadingChange?: (uploading: boolean) => void;
  /** Called when a NEW upload (not initial) is removed/replaced before save */
  onUploadOrphaned?: (publicId: string) => void;
  initialPublicId?: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  function setUp(v: boolean) {
    setUploading(v);
    onUploadingChange?.(v);
  }

  function maybeOrphan(currentId: string | null) {
    if (currentId && currentId !== initialPublicId) {
      onUploadOrphaned?.(currentId);
    }
  }

  function uploadFile(file: File): Promise<{ secure_url: string; public_id: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const sr = await fetch("/api/cloudinary/sign", { method: "POST" });
        if (!sr.ok) return reject(new Error("Sign failed"));
        const sign: SignResponse = await sr.json();

        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sign.apiKey);
        fd.append("timestamp", String(sign.timestamp));
        fd.append("signature", sign.signature);
        fd.append("upload_preset", sign.uploadPreset);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } else {
            reject(new Error(`Upload failed (${xhr.status})`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(fd);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function handle(file: File) {
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Vidéo trop grosse (max 100 MB)");
      return;
    }
    setUp(true);
    setProgress(0);
    try {
      const data = await uploadFile(file);
      // Replacing existing? Mark current as orphan if it was a new upload
      maybeOrphan(value.public_id);
      onChange({ url: data.secure_url, public_id: data.public_id });
      toast.success("Vidéo uploadée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setUp(false);
      setProgress(0);
    }
  }

  return (
    <div className="space-y-3">
      {value.url && (
        <video
          src={value.url}
          controls
          className="w-full max-w-md rounded border border-[var(--color-border)]"
        />
      )}
      <input
        type="file"
        accept="video/*"
        disabled={uploading}
        onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
        className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-[var(--color-card)] file:px-4 file:py-2 file:text-sm hover:file:bg-[var(--color-border)]"
      />
      {uploading && (
        <p className="text-sm text-[var(--color-muted)]">Upload… {progress}%</p>
      )}
      {value.url && !uploading && (
        <button
          type="button"
          onClick={() => {
            maybeOrphan(value.public_id);
            onChange({ url: null, public_id: null });
          }}
          className="text-xs text-red-500 hover:underline"
        >
          Supprimer la vidéo
        </button>
      )}
    </div>
  );
}
