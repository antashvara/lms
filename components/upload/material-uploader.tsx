"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";

type MaterialUploaderProps = {
  onUploadComplete: (files: {
    url: string;
    name: string;
    size: number;
    key: string;
  }[]) => void;
};

export default function MaterialUploader({
  onUploadComplete,
}: MaterialUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      url: string;
      name: string;
      size: number;
      key: string;
    }[]
  >([]);

  return (
    <div className="space-y-4">
      <UploadDropzone
        endpoint="materialUploader"
        onClientUploadComplete={(res) => {
          if (!res) return;

          const files = res.map((file) => ({
            url: file.ufsUrl,
            name: file.name,
            size: file.size,
            key: file.key,
          }));

          setUploadedFiles(files);
          onUploadComplete(files);
        }}
        onUploadError={(error) => {
          console.error("Upload error:", error);
          alert(`Upload gagal: ${error.message}`);
        }}
        appearance={{
          container:
            "border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition",
          label: "text-gray-700",
          allowedContent: "text-gray-500",
          button:
            "bg-violet-600 hover:bg-violet-700 text-white rounded-lg",
        }}
      />

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            File berhasil di-upload:
          </p>

          {uploadedFiles.map((file) => (
            <div
              key={file.key}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {file.name}
                </p>

                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-sm text-violet-600 hover:underline"
              >
                Lihat file
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}