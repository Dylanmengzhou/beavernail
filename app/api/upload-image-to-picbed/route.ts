import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const ocrResult = formData.get("ocrResult") === "true";
    const reservationId = formData.get("reservationId");
    const file = formData.get("file") as File;
    console.log("ocrResult", ocrResult, typeof ocrResult);
    console.log("reservationId", reservationId, typeof reservationId);
    console.log("file", file, typeof file);

    if (!file) {
      return NextResponse.json(
        { success: false, error: "未找到上传文件" },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "请上传图片文件" },
        { status: 400 }
      );
    }
    if (!ocrResult) {
      return NextResponse.json(
        { success: false, error: "图片不符合要求，请上传包含金额或名字的图片" },
        { status: 400 }
      );
    }
    if (!reservationId) {
      return NextResponse.json(
        { success: false, error: "未找到预约ID" },
        { status: 400 }
      );
    }

    // 验证文件大小 (限制为 10MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "文件大小不能超过 50MB" },
        { status: 400 }
      );
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
        { success: false, error: "图片上传失败，请稍后重试" },
        { status: 500 }
      );
    }

    const result = await response.json();

    const imageUrl = "https://telegraph-image-czf.pages.dev" + result[0].src;
    console.log("imageUrl", imageUrl);

    // 检查预约是否存在
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId as string },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "预约不存在" },
        { status: 404 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId as string },
      data: {
        depositPaid: true,
        uploadImage: imageUrl,
        ocrResult: ocrResult,
      },
    });

    // 返回成功结果
    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error("上传处理错误:", error);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
