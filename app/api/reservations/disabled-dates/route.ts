import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
	try {
		// 获取当前会话信息（如果需要验证用户身份）
		const session = await auth();

		// 如果需要验证用户身份，可以在这里检查
		if (!session) {
			return NextResponse.json(
				{ error: "未授权访问" },
				{ status: 401 }
			);
		}

		// 查询所有预约，按日期分组，找出所有时间段都已被预约的日期
		// 这里假设每天有固定的时间段 ["10:00", "12:00", "14:00", "16:00", "19:00"]
		const timeSlots = ["10:00", "12:00", "14:00", "16:00", "19:00"];

		// 获取所有预约记录，按日期分组
		const reservations = await prisma.reservation.findMany({
			select: {
				date: true,
				timeSlot: true,
			},
		});

		// 按日期分组预约
		const reservationsByDate = reservations.reduce(
			(acc, reservation) => {
				const dateStr = reservation.date.toISOString().split("T")[0];
				if (!acc[dateStr]) {
					acc[dateStr] = [];
				}
				acc[dateStr].push(reservation.timeSlot);
				return acc;
			},
			{} as Record<string, string[]>
		);

		// 找出所有时间段都已被预约的日期
		const disabledDates = Object.entries(reservationsByDate)
			.filter(([slots]) => slots.length === timeSlots.length)
			.map(([dateStr]) => dateStr);

		return NextResponse.json({ disabledDates });
	} catch (error) {
		console.error("获取不可预约日期失败:", error);
		return NextResponse.json(
			{ error: "获取不可预约日期失败" },
			{ status: 500 }
		);
	}
}
