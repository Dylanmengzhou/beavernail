import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { addHours, subHours, isBefore } from "date-fns";
import { type NextRequest } from "next/server";

const prisma = new PrismaClient();

// 获取韩国时间（UTC+9）
const getKoreanTime = () => {
	const now = new Date();
	return addHours(now, 9 - now.getTimezoneOffset() / 60);
};

// 检查是否可以取消预约（至少提前24小时）
const canCancelInTime = (reservationDate: Date) => {
	const koreanTime = getKoreanTime();
	const reservationTimeMinusDayKST = subHours(reservationDate, 24);
	return isBefore(koreanTime, reservationTimeMinusDayKST);
};

// 获取单个预约详情
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	const reservationId = searchParams.get("reservationId");

	if (!reservationId) {
		return NextResponse.json(
			{ error: "预约ID不存在" },
			{ status: 400 }
		);
	}

	try {
		// 获取当前登录用户
		const session = await auth();

		if (!session || !session.user) {
			return NextResponse.json({ error: "未授权" }, { status: 401 });
		}

		// 先通过username查找用户
		const user = await prisma.user.findUnique({
			where: {
				username: session.user.username as string,
				provider: session.user.provider as string,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: "用户不存在" },
				{ status: 404 }
			);
		}

		// 获取指定的预约详情
		const reservation = await prisma.reservation.findUnique({
			where: {
				id: reservationId,
				userId: user.id, // 确保只能查看自己的预约
			},
			include: {
				nailArtist: {
					select: { name: true },
				},
			},
		});

		if (!reservation) {
			return NextResponse.json(
				{ error: "预约不存在" },
				{ status: 404 }
			);
		}

		// 确定预约状态
		const now = new Date();
		const isUpcoming = new Date(reservation.date) >= now;

		// 格式化返回数据
		const formattedReservation = {
			id: reservation.id,
			date: reservation.date,
			timeSlot: reservation.timeSlot,
			status: isUpcoming ? "upcoming" : "completed",
			nailArtistName: reservation.nailArtist?.name || "",
		};

		return NextResponse.json(formattedReservation);
	} catch (error) {
		console.error("获取预约详情失败:", error);
		return NextResponse.json(
			{ error: "获取预约详情失败" },
			{ status: 500 }
		);
	}
}

// 取消预约
export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const reservationId = searchParams.get("reservationId");

	if (!reservationId) {
		return NextResponse.json(
			{ error: "预约ID不存在" },
			{ status: 400 }
		);
	}
	try {
		// 获取当前登录用户
		const session = await auth();

		if (!session || !session.user) {
			return NextResponse.json({ error: "未授权" }, { status: 401 });
		}

		// 先通过username查找用户
		const user = await prisma.user.findUnique({
			where: {
				username: session.user.username as string,
				provider: session.user.provider as string,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: "用户不存在" },
				{ status: 404 }
			);
		}

		// 查找预约并确认是否存在
		const reservation = await prisma.reservation.findUnique({
			where: {
				id: reservationId,
				userId: user.id, // 确保只能取消自己的预约
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

		// 删除预约
		await prisma.reservation.delete({
			where: {
				id: reservationId,
			},
		});

		await fetch(process.env.LARK_CANCELED_URL as string, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				msg_type: "text",
				content: {
					whoCancelled: "用户取消",
					username: user?.name,
					contactType: user?.contactType,
					phone: user?.email,
					reservationId: reservationId,
					date: new Date(reservation.date)
						.toISOString()
						.split("T")[0],
					time: reservation.timeSlot,
				},
			}),
		});

		await fetch(process.env.SLACK_URL as string, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text: `❌ *您有一条预约取消了*\n👤 顾客名: *${user?.name}*\n🆔 预约码: *${reservationId}*\n☎️ 联系方式: *${user?.email}*\n🗓 预约日期: *${reservation.date}*\n⌛️ 预约时间: *${reservation.timeSlot}*`,
			}),
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

// 添加OPTIONS方法以支持CORS预检请求
export async function OPTIONS() {
	return NextResponse.json({}, { status: 200 });
}
