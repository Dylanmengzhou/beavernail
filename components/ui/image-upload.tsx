"use client";

import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Button } from "./button";
import { Input } from "./input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

interface ImageUploadProps {
  reservationId?: string;
  onUploadSuccess?: (url: string, ocrResult: OCRResult) => void;
  onUploadError?: (error: string) => void;
}

export function ImageUpload({
  reservationId,
  onUploadSuccess,
  onUploadError,
}: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const performOCR = async (file: File): Promise<OCRResult> => {
    try {
      console.log("📷 正在初始化OCR worker...");
      setIsProcessingOCR(true);

      const worker = await createWorker("kor+eng", 1, {
        logger: (m) => console.log(m),
      });

      console.log("📷 开始OCR识别...");
      const {
        data: { text },
      } = await worker.recognize(file);
      await worker.terminate();

      const recognizedText = text.trim();
      console.log("📝 OCR识别结果:\n", recognizedText);

      // 检查是否包含类似"20,000"、"20000"、"20.000"的金额
      const includesAmount = /20[,.]?000/.test(recognizedText);
      const includesName = /(정영나|비버네일)/.test(recognizedText);

      console.log("\n🔍 检查关键词:");
      console.log("是否包含金额（如20000 / 20,000 / 20.000）:", includesAmount);
      console.log("是否包含名字（정영나 或 비버네일）:", includesName);

      // 修改逻辑：只需要包含金额或名字其中一个即可
      const isValidImage = includesAmount || includesName;

      return {
        success: true,
        text: recognizedText,
        analysis: {
          includesAmount,
          includesName,
          isValidImage,
        },
      };
    } catch (error) {
      console.error("OCR识别错误:", error);
      return {
        success: false,
        error: "OCR识别失败",
        analysis: {
          includesAmount: false,
          includesName: false,
          isValidImage: false,
        },
      };
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const updateReservation = async (
    uploadImage: string,
    ocrResult: OCRResult
  ) => {
    if (!reservationId) {
      console.log("没有提供reservationId，跳过预约更新");
      return true; // 如果没有reservationId，也认为是成功的
    }

    try {
      const response = await fetch("/api/reservations/update-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId,
          uploadImage,
          ocrResult,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("预约更新成功:", result);
        return true;
      } else {
        console.error("预约更新失败:", result.error);
        toast.error("预约信息更新失败", {
          duration: 1500,
          position: "top-center",
        });
        return false;
      }
    } catch (error) {
      console.error("预约更新错误:", error);
      toast.error("预约信息更新失败", {
        duration: 1500,
        position: "top-center",
      });
      return false;
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);

    // 创建预览URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      // 先进行OCR识别
      const ocrResult = await performOCR(file);

      // 检查图片是否符合要求
      if (!ocrResult.analysis?.isValidImage) {
        toast.error("图片不符合要求，请上传包含金额或名字的图片", {
          duration: 1500,
          position: "top-center",
        });
        setIsUploading(false);
        return;
      }

      // 图片符合要求，继续上传
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image-to-picbed", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // 图片上传成功，现在更新预约信息
        const reservationUpdateSuccess = await updateReservation(
          result.url,
          ocrResult
        );

        if (reservationUpdateSuccess) {
          toast.success("上传成功！", {
            duration: 1500,
            position: "top-center",
          });
          onUploadSuccess?.(result.url, ocrResult);

          // 如果有reservationId，跳转到历史页面
          if (reservationId) {
            setTimeout(() => {
              router.push(
                `/reservation/history/singleReservation?reservationId=${reservationId}`
              );
            }, 1500); // 1.5秒后跳转，让用户看到成功提示
          }
        }
      } else {
        toast.error("上传失败，请重试", {
          duration: 1500,
          position: "top-center",
        });
        onUploadError?.(result.error || "上传失败");
      }
    } catch (error) {
      console.error("上传错误:", error);
      toast.error("上传失败，请重试", {
        duration: 1500,
        position: "top-center",
      });
      onUploadError?.("上传过程中发生错误");
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* 拖拽上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div className="space-y-3">
            <Image
              src={previewUrl}
              alt="预览"
              className="max-h-48 mx-auto rounded-lg shadow-md object-contain"
              width={100}
              height={100}
            />
            <div className="text-sm text-gray-600">
              <p>文件名: {file?.name.slice(-10)}</p>
              <p>大小: {((file?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-gray-400">
              <svg
                className="mx-auto h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                点击或拖拽图片到此处
              </p>
              <p className="text-sm text-gray-500 mt-1">
                支持 JPG、PNG、GIF 等格式，最大 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {/* 操作按钮 */}
      {file && (
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={isUploading || isProcessingOCR}
            className="flex-1"
          >
            {isUploading
              ? "上传中..."
              : isProcessingOCR
              ? "OCR识别中..."
              : "上传图片"}
          </Button>
          <Button
            onClick={resetUpload}
            variant="outline"
            disabled={isUploading || isProcessingOCR}
          >
            重选
          </Button>
        </div>
      )}
    </div>
  );
}
