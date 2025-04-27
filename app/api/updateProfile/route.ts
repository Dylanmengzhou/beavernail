import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
	let body;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json(
			{ success: false, message: "请求格式错误" },
			{ status: 400 }
		);
	}

	const { userId, nickName, contactNumber } = body;

	// 更严谨的验证
	if (
		!userId?.trim() ||
		!nickName?.trim() ||
		!contactNumber?.trim()
	) {
		return NextResponse.json(
			{ success: false, message: "缺少必要信息" },
			{ status: 400 }
		);
	}

	try {
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				nickname: nickName,
				email: contactNumber,
			},
			select: {
				id: true,
				name: true,
				nickname: true,
				email: true,
				image: true,
			},
		});

		return NextResponse.json({
			success: true,
			message: "更新成功",
			data: updatedUser, // 返回最新用户信息
		});
	} catch (error) {
		console.error("更新过程中发生错误:", error);
		return NextResponse.json(
			{ success: false, message: "服务器内部错误" },
			{ status: 500 }
		);
	}
}
