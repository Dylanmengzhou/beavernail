import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
	try {
		// 获取当前会话信息
		const session = await auth();

		// 验证用户身份
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "请先登录后再进行预约" },
				{ status: 401 }
			);
		}

		// 解析请求体
		const body = await request.json();
		const { date, timeSlot, nailArtistId } = body;

		if (!date || !timeSlot || !nailArtistId) {
			return NextResponse.json(
				{ error: "日期、时间段和美甲师不能为空" },
				{ status: 400 }
			);
		}

		// 检查该美甲师该时间段是否已被预约
		const existingReservation = await prisma.reservation.findFirst({
			where: {
				date: new Date(date),
				timeSlot: timeSlot,
				nailArtistId: nailArtistId,
			},
		});

		if (existingReservation) {
			return NextResponse.json(
				{ error: "该美甲师该时间段已被预约，请选择其他时间" },
				{ status: 409 }
			);
		}

		// 获取用户ID
		const userId = session.user.id;
		const userInfo = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				name: true,
				email: true,
				contactType: true
			},
		});
		// 创建新预约
		const newReservation = await prisma.reservation.create({
			data: {
				date: new Date(date),
				timeSlot,
				userId,
				nailArtistId,
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
					contactType: userInfo?.contactType,
				},
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
