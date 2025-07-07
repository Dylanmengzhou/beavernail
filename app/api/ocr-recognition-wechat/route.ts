import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";

export async function POST(request: NextRequest) {
  try {
    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "未找到上传的文件",
        },
        { status: 400 }
      );
    }

    // 将文件转换为Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 创建Tesseract worker
    const worker = await createWorker("chi_sim+kor+eng", 1, {
      workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
    });

    try {
      // 进行OCR识别
      console.log("开始OCR识别...");
      const {
        data: { text },
      } = await worker.recognize(buffer);

      console.log("OCR识别完成，识别到的文本:", text);

      // 更强的文本清理逻辑
      let cleanedText = text;

      // 1. 去掉常见的OCR噪声字符
      cleanedText = cleanedText.replace(/[@®™©°±×÷¢£¥€§¶•‚„…‰‹›""''–—]/g, "");

      // 2. 去掉多余的标点符号（保留基本的标点）
      cleanedText = cleanedText.replace(/[<>{}[\]\\|`~]/g, "");

      // 3. 清理多余的空格和换行符
      cleanedText = cleanedText.replace(/\s+/g, "");

      // 4. 去掉首尾空格
      cleanedText = cleanedText.trim();

      // 5. 去掉孤立的单个字符（除了数字和常见的单字母词）
      cleanedText = cleanedText.replace(/\b[a-zA-Z]\b(?!\s*\d)/g, "");

      // 6. 再次清理多余的空格
      cleanedText = cleanedText.replace(/\s+/g, " ").trim();

      return NextResponse.json({
        success: true,
        text: cleanedText,
        message: "识别成功",
      });
    } finally {
      // 确保worker被正确关闭
      await worker.terminate();
    }
  } catch (error) {
    console.error("OCR识别失败:", error);

    return NextResponse.json(
      {
        success: false,
        message: `OCR识别失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
        text: "",
      },
      { status: 500 }
    );
  }
}
