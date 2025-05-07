import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 获取当前会话信息（如果需要验证用户身份）
      // const session = await auth();

    // 如果需要验证用户身份，可以在这里检查
    // if (!session) {
    //   return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    // }

    // 从URL获取日期参数
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const nailArtistId = searchParams.get("nailArtistId");

    if (!dateParam) {
      return NextResponse.json(
        { error: "缺少日期参数" },
        { status: 400 }
      );
    }
    if (!nailArtistId) {
      return NextResponse.json(
        { error: "缺少美甲师参数" },
        { status: 400 }
      );
    }

    // 解析日期
    const date = new Date(dateParam);

    // 查询指定日期和美甲师的所有预约
    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
        nailArtistId: nailArtistId,
      },
      select: {
        timeSlot: true,
      },
    });

    // 提取已被预约的时间段
    const unavailableTimes = reservations.map(
      (reservation) => reservation.timeSlot
    );

    return NextResponse.json({ unavailableTimes });
  } catch (error) {
    console.error("获取不可预约时间段失败:", error);
    return NextResponse.json(
      { error: "获取不可预约时间段失败" },
      { status: 500 }
    );
  }
}