"use client";

import { useState } from "react";
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
  /** Called when a NEW upload (not from initial) is removed before save */
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
  return {
    cloudinary_url: data.secure_url,
    cloudinary_public_id: data.public_id,
  };
}

export function ImageUploader({ initial = [], onChange, onUploadingChange, onUploadOrphaned }: Props) {
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
    }
  }

  function remove(publicId: string) {
    if (!initialIds.has(publicId)) {
      // New upload removed before save → mark for Cloudinary cleanup
      onUploadOrphaned?.(publicId);
    }
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
    <div className="space-y-4">
      <label className="block">
        <span className="block text-sm uppercase tracking-wider text-[var(--color-muted)]">
          Images
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="mt-2 block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-[var(--color-card)] file:px-4 file:py-2 file:text-sm hover:file:bg-[var(--color-border)]"
        />
        {uploading && <p className="mt-2 text-sm text-[var(--color-muted)]">Upload…</p>}
      </label>

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, idx) => (
            <li
              key={img.cloudinary_public_id}
              className="relative aspect-square overflow-hidden rounded border border-[var(--color-border)]"
            >
              <CldImage
                src={img.cloudinary_url}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-1 text-xs">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}>
                  ←
                </button>
                <button type="button" onClick={() => remove(img.cloudinary_public_id)} className="text-red-400">
                  ✕
                </button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === images.length - 1}>
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
