"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./button";
import { X } from "lucide-react";

interface ImageViewerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ImageViewer({
  src,
  alt,
  width = 100,
  height = 100,
  className = "",
  style,
}: ImageViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* 缩略图 */}
      <div
        className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        onClick={openModal}
        title="点击查看大图"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="rounded-lg shadow-lg"
          style={style}
        />
      </div>

      {/* 模态框 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* 关闭按钮 */}
            <Button
              onClick={closeModal}
              variant="outline"
              className="fixed top-2 right-2 z-10 bg-white rounded-2xl p-2!"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* 大图 */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Image
                src={src}
                alt={alt}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                style={{ width: "auto", height: "auto" }}
              />
            </div>

            {/* 图片信息 */}
            <div className="mt-4 text-center">
              <p className="text-white text-sm bg-black bg-opacity-50 rounded px-2 py-1 inline-block">
                {alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
