import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  materialUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      // Nantinya kita tambahkan autentikasi Guru di sini
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload berhasil!");
      console.log("Nama file:", file.name);
      console.log("URL file:", file.ufsUrl);

      return {
        fileName: file.name,
        fileUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;