import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addHours, subHours, isBefore } from "date-fns";
const prisma = new PrismaClient();
// 获取韩国时间（UTC+9）
const getKoreanTime = () => {
	const now = new Date();
	return addHours(now, 9 - now.getTimezoneOffset() / 60);
};

const canCancelInTime = (reservationDate: Date) => {
	const koreanTime = getKoreanTime();
	const reservationTimeMinusDayKST = subHours(reservationDate, 24);
	return isBefore(koreanTime, reservationTimeMinusDayKST);
};

export async function POST(req: NextRequest) {
	try {
		const { reservationId, userId } = await req.json();
		const reservation = await prisma.reservation.findUnique({
			where: {
				id: reservationId,
				userId: userId, // 确保只能取消自己的预约
			},
		});

		if (!reservation) {
			return NextResponse.json(
				{ error: "预约不存在" },
				{ status: 404 }
			);
		}

		// 确认预约是否可以取消（是否为未来的预约）
		const now = new Date();
		if (new Date(reservation.date) < now) {
			return NextResponse.json(
				{ error: "无法取消已完成的预约" },
				{ status: 400 }
			);
		}
		// 检查是否满足24小时提前取消规则（以韩国时间为准）
		if (!canCancelInTime(new Date(reservation.date))) {
			return NextResponse.json(
				{ error: "预约需要提前24小时取消（以韩国时间为准）" },
				{ status: 400 }
			);
		}
		await prisma.reservation.delete({
			where: {
				id: reservationId,
			},
		});
		return NextResponse.json({ message: "预约已成功取消" });
	} catch (error) {
		console.error("取消预约失败:", error);
		return NextResponse.json(
			{ error: "取消预约失败" },
			{ status: 500 }
		);
	}
}
