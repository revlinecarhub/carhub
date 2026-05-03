"use client";

import { useRef, useState } from "react";
import { Film, Loader2, X } from "lucide-react";
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
  onUploadOrphaned?: (publicId: string) => void;
  initialPublicId?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
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
            resolve(JSON.parse(xhr.responseText));
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
      maybeOrphan(value.public_id);
      onChange({ url: data.secure_url, public_id: data.public_id });
      toast.success("Vidéo uploadée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setUp(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        disabled={uploading}
        onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
        className="hidden"
      />
      {value.url ? (
        <div className="space-y-2">
          <div className="relative">
            <video
              src={value.url}
              controls
              className="w-full max-w-sm rounded-lg border border-[var(--color-border)]"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => {
                maybeOrphan(value.public_id);
                onChange({ url: null, public_id: null });
              }}
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-red-500"
              aria-label="Supprimer la vidéo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] disabled:opacity-50"
          >
            Remplacer
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs">{progress}%</span>
            </>
          ) : (
            <>
              <Film className="h-6 w-6" />
              <span className="text-xs">Ajouter</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
