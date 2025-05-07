import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { date, timeSlot } = await request.json();

    // 将字符串日期转换为Date对象
    const searchDate = new Date(date);

    // 查询匹配的预约
    const reservation = await prisma.reservation.findFirst({
      where: {
        date: searchDate,
        timeSlot: timeSlot,
      },
      select: {
        id: true,
        nailArtist: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: "预约未找到" }, { status: 404 });
    }

    return NextResponse.json({ id: reservation.id, nailArtist: reservation.nailArtist });
  } catch (error) {
    console.error("获取预约ID失败:", error);
    return NextResponse.json({ error: "获取预约ID失败" }, { status: 500 });
  }
}