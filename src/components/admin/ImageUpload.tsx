"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ImageUploadProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
};

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUpload({
  value,
  onChange,
  label = "Şəkil",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Yalnız JPG, PNG, SVG və WebP faylları dəstəklənir.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Fayl ölçüsü 5MB-dən çox ola bilməz.");
        return;
      }

      setUploading(true);

      try {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          onChange(urlData.publicUrl);
        } else {
          throw new Error("Public URL alına bilmədi.");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Yükləmə xətası baş verdi.";
        setError(message);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    e.target.value = "";
  }

  function handleRemove() {
    onChange(null);
    setError(null);
  }

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>

      {value ? (
        <div className="relative mt-1 overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--background)]">
          <div className="relative aspect-video w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={() => {
                setError("Şəkil yüklənə bilmədi. URL düzgün olmaya bilər.");
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
            title="Şəkli sil"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? "border-violet-500 bg-violet-500/10"
              : "border-[var(--card-border)] hover:border-violet-500/50 hover:bg-[var(--section)]"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
              <p className="mt-3 text-sm text-[var(--muted)]">Yüklənir...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 text-[var(--accent)]">
                <Upload size={22} />
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--foreground)]">
                Şəkli bura sürükləyin və ya klikləyin
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                JPG, PNG, SVG, WebP — maksimum 5MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
        disabled={uploading}
      />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {value && (
        <div className="mt-2 flex items-center gap-2">
          <ImageIcon size={12} className="text-[var(--muted)]" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value || null)}
            className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-1 text-xs text-[var(--muted)] outline-none focus:border-violet-500"
            placeholder="URL"
          />
        </div>
      )}
    </div>
  );
}