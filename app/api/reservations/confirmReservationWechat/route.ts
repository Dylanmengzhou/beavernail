import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json();
    const { date, timeSlot, userId, nailArtistId } = body;

    if (!date || !timeSlot) {
      return NextResponse.json(
        { error: "日期和时间段不能为空" },
        { status: 400 }
      );
    }
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        contactType: true,
        provider: true,
        membershipType: true,
      },
    });

    // 检查该时间段是否已被预约
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        date: new Date(date),
        timeSlot: timeSlot,
        nailArtistId: nailArtistId,
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "该时间段已被预约，请选择其他时间" },
        { status: 409 }
      );
    }

    // 获取用户ID

    // 创建新预约
    const newReservation = await prisma.reservation.create({
      data: {
        date: new Date(date),
        timeSlot,
        userId,
        nailArtistId,
        currentMemberShip: userInfo?.membershipType,
      },
    });

    const nailArtist = await prisma.nailArtist.findUnique({
      where: { id: nailArtistId },
      select: {
        name: true,
      },
    });

    await fetch(process.env.LARK_SUCCESS_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "text",
        content: {
          whoRegistered: "用户",
          username: userInfo?.name,
          phone: userInfo?.email,
          date: date,
          time: timeSlot,
          contactType: userInfo?.contactType,
          provider: userInfo?.provider,
          nailArtist: nailArtist?.name,
        },
      }),
    });

    return NextResponse.json({
      message: "预约成功",
      reservation: newReservation,
    });
  } catch (error) {
    console.error("创建预约失败:", error);
    return NextResponse.json(
      { error: "创建预约失败，请稍后再试" },
      { status: 500 }
    );
  }
}
