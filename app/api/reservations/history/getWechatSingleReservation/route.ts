import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 确保导出正确的HTTP方法处理函数
export async function POST(request: Request) {
  const body = await request.json();

  const { userId, reservationId } = body;
  console.log("用户ID：", userId);
  console.log("预约ID：", reservationId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId as string,
      provider: "wechat",
    },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: {
      id: reservationId as string,
      userId: userId as string,
    },
    include: {
      nailArtist: true,
    },
  });

  return NextResponse.json(reservation);
}
