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
		const userInfo = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				name: true,
				email: true,
			},
		});

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

		await fetch(process.env.LARK_SUCCESS_URL as string, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				msg_type: "text",
				content: {
					username: userInfo?.name,
					phone: userInfo?.email,
					date: date,
					time: timeSlot,
				},
			}),
		});

		await fetch(process.env.SLACK_URL as string, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text: `✅ *你有新的预约*\n👤 顾客名: *${userInfo?.name}*\n☎️ 联系方式: *${userInfo?.email}*\n🗓 预约日期: *${date}*\n⌛️ 预约时间: *${timeSlot}*`,
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
