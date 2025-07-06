"use client";

import { ImageUpload } from "@/components/ui/image-upload";
import { useSearchParams } from "next/navigation";

interface OCRResult {
  success: boolean;
  text?: string;
  analysis?: {
    includesAmount: boolean;
    includesName: boolean;
    isValidImage: boolean;
  };
  error?: string;
}

export default function UploadImagePage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const handleUploadSuccess = (url: string, ocrResult: OCRResult) => {
    console.log("上传成功:", url);
    console.log("OCR结果:", ocrResult);
    // 不显示任何提示，只在控制台记录
  };

  const handleUploadError = (error: string) => {
    console.error("上传失败:", error);
    // 可以选择显示错误或者静默处理
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl h-full">
      <h1 className="text-2xl font-bold mb-6">转账截图上传</h1>

      <ImageUpload
        reservationId={reservationId || undefined}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
    </div>
  );
}
