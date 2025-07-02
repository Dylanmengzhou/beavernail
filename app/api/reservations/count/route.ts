import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "用户名是必需的" },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username,provider: session?.user.provider as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // 计算用户的预约次数
    const reservationsCount = await prisma.reservation.count({
      where: { userId: user.id },
    });
    const remainBalance: { balance: string }[] = await prisma.$queryRaw`
      SELECT 
        GREATEST(u."balance" - COALESCE((
          SELECT SUM(r2."finalPrice")
          FROM "Reservation" r2
          WHERE r2."userId" = u.id 
          AND r2."paymentMethod" = 'memberCard'
          AND r2."finalPrice" IS NOT NULL
        ), 0), 0) AS "balance"
      FROM "User" u
      WHERE id = ${user.id}
    `
    return NextResponse.json({ count: reservationsCount, remainBalance: Number(remainBalance[0].balance) });
  } catch (error) {
    console.error("获取预约次数时出错:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}