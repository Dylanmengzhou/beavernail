import { NextRequest, NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "没有找到图片文件" }, { status: 400 });
    }

    console.log("开始处理图片:", file.name, "大小:", file.size);

    // 将文件转换为 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("开始 OCR 识别...");

    // 使用 tesseract.js 进行 OCR 识别
    // 支持韩语 (kor) 和英文 (eng)
    const {
      data: { text },
    } = await Tesseract.recognize(
      buffer,
      "kor+eng", // 同时识别韩语和英文
      {
        logger: (m) => console.log(m), // 输出处理进度
      }
    );

    console.log("OCR 识别完成");
    console.log("识别结果:", text);

    return NextResponse.json({
      success: true,
      text: text,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("OCR 处理错误:", error);
    return NextResponse.json(
      {
        error: "处理失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
