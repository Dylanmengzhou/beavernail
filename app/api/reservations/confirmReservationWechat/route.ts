import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
	try {
		// 解析请求体
        const body = await request.json();
		const { date, timeSlot, userId } = body;

		if (!date || !timeSlot) {
			return NextResponse.json(
				{ error: "日期和时间段不能为空" },
				{ status: 400 }
			);
		}

		// 检查该时间段是否已被预约
		const existingReservation = await prisma.reservation.findUnique({
			where: {
				date_timeSlot: {
					date: new Date(date),
					timeSlot: timeSlot,
				},
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
			},
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
