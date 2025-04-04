import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
	const session = await auth();
	console.log(session)
	try {
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "请先登录后再进行预约" },
				{ status: 401 }
			);
		}
		

		const username = session.user.username;

		if (!username) {
			return NextResponse.json(
				{ error: "用户账号不能为空" },
				{ status: 400 }
			);
		}

		const userWithReservations = await prisma.user.findUnique({
			where: {
				username: username,
			},
			include: {
				reservations: {
					where: {
						date: {
							gte: new Date(), // 只获取今天及以后的预约
						},
					},
					orderBy: {
						date: "asc",
					},
					take: 1, // 只获取最近的一个预约
				},
			},
		});

		if (!userWithReservations || userWithReservations.reservations.length === 0) {
			return NextResponse.json({ nextReservation: null });
		}

		return NextResponse.json({
			nextReservation: userWithReservations.reservations[0]
		});

	} catch (error) {
		console.error("获取最近行程失败:", error);
		return NextResponse.json(
			{ error: "获取最近行程失败" },
			{ status: 500 }
		);
	}
}
