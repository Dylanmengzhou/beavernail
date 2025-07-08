import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";

// 🔥 确保使用Node.js runtime
export const runtime = "nodejs";
export const maxDuration = 30;

interface OCRResult {
  success: boolean;
  text?: string;
  analysis?: {
    includesAmount: boolean;
    includesName: boolean;
    isValidImage: boolean;
  };
  error?: string;
  debug?: {
    imageSize: number;
    processingTime: number;
    environment: string;
  };
}

async function performTestOCR(imageBuffer: Buffer): Promise<OCRResult> {
  const startTime = Date.now();
  let worker;

  try {
    console.log("🧪 [TEST] 开始OCR测试...");
    console.log("🧪 [TEST] 图片大小:", imageBuffer.length, "bytes");
    console.log("🧪 [TEST] Node.js版本:", process.version);
    console.log("🧪 [TEST] 运行环境:", process.env.VERCEL ? "Vercel" : "Local");

    // 🔥 创建tesseract.js worker
    worker = await createWorker("kor+eng", 1, {
      logger: (m) => console.log("🧪 [TESSERACT]", m),
      // 在Node.js环境中，让tesseract.js自动处理路径
    });

    console.log("🧪 [TEST] Worker创建成功，开始识别...");
    const {
      data: { text },
    } = await worker.recognize(imageBuffer);

    const recognizedText = text.trim();
    const recognizedWithoutSpace = recognizedText.replace(/\s/g, "");
    console.log("🧪 [TEST] OCR原始结果:", recognizedText);
    console.log("🧪 [TEST] OCR清理后结果:", recognizedWithoutSpace);

    // 检查关键词
    const includesAmount = /20[,.]?000/.test(recognizedWithoutSpace);
    const includesName = /(정영나|비버네일)/.test(recognizedWithoutSpace);
    const isValidImage = includesAmount || includesName;

    console.log("🧪 [TEST] 分析结果:");
    console.log("  - 包含金额:", includesAmount);
    console.log("  - 包含名字:", includesName);
    console.log("  - 图片有效:", isValidImage);

    const processingTime = Date.now() - startTime;
    console.log("🧪 [TEST] 处理时间:", processingTime, "ms");

    return {
      success: true,
      text: recognizedWithoutSpace,
      analysis: {
        includesAmount,
        includesName,
        isValidImage,
      },
      debug: {
        imageSize: imageBuffer.length,
        processingTime,
        environment: process.env.VERCEL ? "Vercel" : "Local",
      },
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("🧪 [TEST] OCR错误:", error);
    console.error(
      "🧪 [TEST] 错误详情:",
      error instanceof Error ? error.stack : error
    );

    return {
      success: false,
      error: `OCR识别失败: ${
        error instanceof Error ? error.message : "未知错误"
      }`,
      analysis: {
        includesAmount: false,
        includesName: false,
        isValidImage: false,
      },
      debug: {
        imageSize: imageBuffer.length,
        processingTime,
        environment: process.env.VERCEL ? "Vercel" : "Local",
      },
    };
  } finally {
    if (worker) {
      try {
        await worker.terminate();
        console.log("🧪 [TEST] Worker已终止");
      } catch (terminateError) {
        console.error("🧪 [TEST] Worker终止错误:", terminateError);
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 [API] 收到OCR测试请求");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("🧪 [API] 错误: 未找到上传文件");
      return NextResponse.json(
        {
          success: false,
          error: "未找到上传文件",
          usage:
            "curl -X POST http://localhost:3000/api/test-ocr -F 'file=@image.jpg'",
        },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      console.log("🧪 [API] 错误: 文件类型不正确:", file.type);
      return NextResponse.json(
        {
          success: false,
          error: "请上传图片文件",
          fileType: file.type,
        },
        { status: 400 }
      );
    }

    // 验证文件大小
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      console.log("🧪 [API] 错误: 文件太大:", file.size);
      return NextResponse.json(
        {
          success: false,
          error: "文件大小不能超过 10MB",
          fileSize: file.size,
        },
        { status: 400 }
      );
    }

    console.log("🧪 [API] 文件验证通过");
    console.log("🧪 [API] 文件名:", file.name);
    console.log("🧪 [API] 文件类型:", file.type);
    console.log("🧪 [API] 文件大小:", file.size, "bytes");

    // 转换为Buffer
    const imageBuffer = Buffer.from(await file.arrayBuffer());
    console.log("🧪 [API] 开始OCR处理...");

    // 执行OCR
    const ocrResult = await performTestOCR(imageBuffer);

    console.log("🧪 [API] OCR处理完成");
    console.log("🧪 [API] 返回结果:", JSON.stringify(ocrResult, null, 2));

    return NextResponse.json({
      ...ocrResult,
      timestamp: new Date().toISOString(),
      requestInfo: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        userAgent: request.headers.get("user-agent"),
      },
    });
  } catch (error) {
    console.error("🧪 [API] 处理错误:", error);
    console.error(
      "🧪 [API] 错误详情:",
      error instanceof Error ? error.stack : error
    );

    return NextResponse.json(
      {
        success: false,
        error: "服务器内部错误",
        details: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// 添加GET方法用于健康检查
export async function GET() {
  return NextResponse.json({
    status: "OK",
    message: "OCR测试API正常运行",
    environment: process.env.VERCEL ? "Vercel" : "Local",
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    usage: {
      method: "POST",
      endpoint: "/api/test-ocr",
      curl: "curl -X POST http://localhost:3000/api/test-ocr -F 'file=@image.jpg'",
      description: "上传图片进行OCR识别测试",
    },
  });
}
