import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Camera, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  onSubmit: (files: File[]) => void;
  onSkip: () => void;
}

export default function PhotoUpload({ onSubmit, onSkip }: PhotoUploadProps) {
  const { t } = useTranslation("diagnostic");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles = Array.from(selected).slice(0, 2 - files.length);
    const updated = [...files, ...newFiles].slice(0, 2);
    setFiles(updated);

    // Generate previews
    const newPreviews = updated.map((f) => URL.createObjectURL(f));
    // Revoke old previews
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPreviews(newPreviews);

    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(index: number) {
    const url = previews[index];
    if (url) URL.revokeObjectURL(url);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="px-4 pb-20 pt-8">
      <h1 className="font-serif text-h2 text-gray-900">{t("photoUpload.title")}</h1>
      <p className="mt-2 text-body text-gray-600">
        {t("photoUpload.subtitle")}
      </p>
      <p className="mt-1 text-caption text-gray-400">
        {t("photoUpload.aiNote")}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[0, 1].map((idx) => (
          <div key={idx}>
            <p className="mb-1.5 text-caption font-medium text-gray-700">
              {idx === 0 ? t("photoUpload.overview") : t("photoUpload.closeup")}
            </p>
            {previews[idx] ? (
              <div className="relative aspect-square overflow-hidden rounded-md border border-gray-200">
                <img
                  src={previews[idx]}
                  alt={idx === 0 ? t("photoUpload.overview") : t("photoUpload.closeup")}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300",
                  "text-gray-400 transition-colors duration-fast",
                  "hover:border-gold-500 hover:text-gold-500",
                )}
              >
                <Camera className="h-8 w-8" />
                <span className="text-caption">{t("photoUpload.add")}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mt-8 space-y-3">
        {files.length > 0 && (
          <Button
            variant="primary"
            className="w-full gap-2"
            onClick={() => onSubmit(files)}
          >
            <Upload className="h-4 w-4" />
            {t(files.length > 1 ? "photoUpload.analyzePlural" : "photoUpload.analyze", { count: files.length })}
          </Button>
        )}
        <Button variant="ghost" className="w-full" onClick={onSkip}>
          {t("photoUpload.skip")}
        </Button>
      </div>
    </div>
  );
}
