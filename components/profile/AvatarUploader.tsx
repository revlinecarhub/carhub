"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CldImage } from "next-cloudinary";
import { User } from "lucide-react";

export type AvatarValue = {
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

export function AvatarUploader({
  value,
  onChange,
}: {
  value: AvatarValue;
  onChange: (next: AvatarValue) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handle(file: File) {
    setUploading(true);
    try {
      const sr = await fetch("/api/cloudinary/sign", { method: "POST" });
      if (!sr.ok) throw new Error("Sign failed");
      const sign: SignResponse = await sr.json();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sign.apiKey);
      fd.append("timestamp", String(sign.timestamp));
      fd.append("signature", sign.signature);
      fd.append("upload_preset", sign.uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange({ url: data.secure_url, public_id: data.public_id });
      toast.success("Avatar uploadé");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-card)]">
        {value.url ? (
          <CldImage src={value.url} alt="Avatar" fill sizes="96px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
            <User className="h-12 w-12" />
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
        className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-[var(--color-card)] file:px-4 file:py-2 file:text-sm hover:file:bg-[var(--color-border)]"
      />
      {value.url && (
        <button
          type="button"
          onClick={() => onChange({ url: null, public_id: null })}
          className="text-xs text-red-500 hover:underline"
        >
          Supprimer l&apos;avatar
        </button>
      )}
    </div>
  );
}
