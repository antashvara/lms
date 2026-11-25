"use client";

import { useState } from "react";
import MaterialUploader from "@/components/upload/material-uploader";

export default function TestUploadPage() {
  const [files, setFiles] = useState<
    {
      url: string;
      name: string;
      size: number;
      key: string;
    }[]
  >([]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          UploadThing Test
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Tes upload file PDF menggunakan UploadThing.
        </p>

        <div className="mt-6">
          <MaterialUploader
            onUploadComplete={(uploadedFiles) => {
              setFiles(uploadedFiles);
            }}
          />
        </div>

        {files.length > 0 && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <h2 className="font-semibold text-green-800">
              Upload berhasil!
            </h2>

            <pre className="mt-3 overflow-x-auto text-xs text-green-900">
              {JSON.stringify(files, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}