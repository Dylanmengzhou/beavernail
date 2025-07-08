import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Tesseract from "tesseract.js";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const reservationId = formData.get("reservationId") as string;

    console.log("reservationId", reservationId);

    if (!file) {
      return NextResponse.json({ message: "未找到上传文件" }, { status: 400 });
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "请上传图片文件" }, { status: 400 });
    }

    // 验证文件大小 (限制为 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "文件大小不能超过 10MB" },
        { status: 400 }
      );
    }
    // 将文件转换为 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(
        buffer,
        "kor+eng", // 同时识别韩语和英文
        {
          logger: (m) => console.log(m), // 输出处理进度
        }
      );
      const recognizedText = text.trim();
      const recognizedWithoutSpace = recognizedText.replace(/\s/g, "");

      const includesAmount = /20[,.]?000/.test(recognizedWithoutSpace);
      const includesName = /(정영나|비버네일)/.test(recognizedWithoutSpace);
      const isValidImage = includesAmount || includesName;

      if (!isValidImage) {
        return NextResponse.json(
          { message: "图片不符合要求，请上传包含金额或名字的图片" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("OCR 识别错误:", error);
      return NextResponse.json({ message: "OCR 识别失败" }, { status: 500 });
    }

    // 创建新的 FormData 对象发送到图床
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    // 发送到图床服务
    const response = await fetch(
      "https://telegraph-image-czf.pages.dev/upload",
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("图床服务错误:", errorText);
      return NextResponse.json(
        { message: "图片上传失败，请稍后重试" },
        { status: 500 }
      );
    }

    const result = await response.json();

    await prisma.reservation.update({
      where: {
        id: reservationId as string,
      },
      data: {
        uploadImage: "https://telegraph-image-czf.pages.dev" + result[0].src,
      },
    });
    console.log("result[0].src", result[0].src);

    // 返回成功结果
    return NextResponse.json({
      success: true,
      url: "https://telegraph-image-czf.pages.dev" + result[0].src,
      message: "图片上传成功",
    });
  } catch (error) {
    console.error("上传处理错误:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
