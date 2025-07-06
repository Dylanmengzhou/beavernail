import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// 确保导出正确的HTTP方法处理函数
export async function GET(request: Request) {
  try {
    // 获取当前登录用户
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 从URL获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const filter = searchParams.get("filter") || "all";

    // 计算分页
    const skip = (page - 1) * limit;

    // 先通过username查找用户
    const user = await prisma.user.findUnique({
      where: {
        username: session.user.username as string,
        provider: session.user.provider as string,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 构建查询条件，使用找到的用户ID
    const whereClause: Prisma.ReservationWhereInput = {
      userId: user.id,
    };

    // 根据过滤条件调整查询
    const now = new Date();
    if (filter === "upcoming") {
      whereClause.date = { gte: now };
    } else if (filter === "completed") {
      whereClause.date = { lt: now };
    }

    // 查询总数
    const total = await prisma.reservation.count({
      where: whereClause,
    });

    // 查询预约
    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        date: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        nailArtist: {
          select: {
            name: true,
          },
        },
      },
    });

    // 计算总页数
    const totalPages = Math.ceil(total / limit);

    // 转换数据格式
    const formattedReservations = reservations.map((reservation) => {
      const isUpcoming = new Date(reservation.date) >= now;
      return {
        id: reservation.id,
        date: reservation.date,
        timeSlot: reservation.timeSlot,
        status: isUpcoming ? "upcoming" : "completed",
        nailArtistName: reservation.nailArtist?.name || "",
        finalPrice: reservation.finalPrice,
        paymentMethod: reservation.paymentMethod,
        currentMemberShip: reservation.currentMemberShip,
        depositPaid: reservation.depositPaid,
      };
    });

    return NextResponse.json({
      reservations: formattedReservations,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("获取预约记录失败:", error);
    return NextResponse.json({ error: "获取预约记录失败" }, { status: 500 });
  }
}

// 添加OPTIONS方法以支持CORS预检请求
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}