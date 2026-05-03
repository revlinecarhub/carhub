"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CldImage } from "next-cloudinary";

export type UploadedImage = {
  cloudinary_url: string;
  cloudinary_public_id: string;
};

type Props = {
  initial?: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
  onUploadOrphaned?: (publicId: string) => void;
};

type SignResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  uploadPreset: string;
};

async function uploadOne(file: File): Promise<UploadedImage> {
  const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!signRes.ok) throw new Error("Signature failed");
  const sign: SignResponse = await signRes.json();

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sign.apiKey);
  fd.append("timestamp", String(sign.timestamp));
  fd.append("signature", sign.signature);
  fd.append("upload_preset", sign.uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    { method: "POST", body: fd }
  );
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return { cloudinary_url: data.secure_url, cloudinary_public_id: data.public_id };
}

export function ImageUploader({ initial = [], onChange, onUploadingChange, onUploadOrphaned }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>(initial);
  const [uploading, setUploading] = useState(false);
  const initialIds = new Set(initial.map((i) => i.cloudinary_public_id));

  function setUp(v: boolean) {
    setUploading(v);
    onUploadingChange?.(v);
  }

  function update(next: UploadedImage[]) {
    setImages(next);
    onChange(next);
  }

  async function handleFiles(files: FileList) {
    setUp(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadOne));
      update([...images, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploadée(s)`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setUp(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(publicId: string) {
    if (!initialIds.has(publicId)) onUploadOrphaned?.(publicId);
    update(images.filter((i) => i.cloudinary_public_id !== publicId));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    update(next);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        onChange={(e) => e.target.files && e.target.files.length > 0 && handleFiles(e.target.files)}
        className="hidden"
      />
      <ul className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <li
            key={img.cloudinary_public_id}
            className="relative aspect-square w-32 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]"
          >
            <CldImage src={img.cloudinary_url} alt="" fill sizes="128px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-1 text-xs text-white">
              <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0} className="px-1 disabled:opacity-30">←</button>
              <button type="button" onClick={() => remove(img.cloudinary_public_id)} className="px-1 text-red-400">✕</button>
              <button type="button" onClick={() => move(idx, 1)} disabled={idx === images.length - 1} className="px-1 disabled:opacity-30">→</button>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
            <span className="text-xs">{uploading ? "Upload…" : "Ajouter"}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
