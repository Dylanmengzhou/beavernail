import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 确保导出正确的HTTP方法处理函数
export async function POST(request: Request) {
	try {
		const body = await request.json();

        const { userId } = body;
        console.log("用户ID：",userId)

		// 先通过username查找用户
		const user = await prisma.user.findUnique({
			where: {
				id: userId as string,
				provider: "wechat",
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: "用户不存在" },
				{ status: 404 }
			);
		}

		// 查询预约
		const reservations = await prisma.reservation.findMany({
			where: {
				userId: userId,
			},
			orderBy: {
				date: "asc",
			},
			include: {
				nailArtist: {
					select: { name: true },
				},
			},
		});

		return NextResponse.json({
			message: "获取预约数据成功",
			reservations: reservations,
		});
	} catch (error) {
		console.error("获取预约记录失败:", error);
		return NextResponse.json(
			{ error: "获取预约记录失败" },
			{ status: 500 }
		);
	}
}