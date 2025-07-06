import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { reservationId, uploadImage, ocrResult } = await request.json();

    if (!reservationId) {
      return NextResponse.json({ error: "缺少预约ID" }, { status: 400 });
    }

    // 检查预约是否存在
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json({ error: "预约不存在" }, { status: 404 });
    }

    // 更新预约的uploadImage和ocrResult
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        depositPaid: true,
        uploadImage: uploadImage,
        ocrResult: ocrResult?.analysis?.isValidImage || false,
      },
    });

    console.log("预约更新成功:", {
      id: reservationId,
      uploadImage,
      ocrResult: ocrResult?.analysis?.isValidImage,
    });

    return NextResponse.json({
      success: true,
      message: "预约信息更新成功",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("更新预约错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
