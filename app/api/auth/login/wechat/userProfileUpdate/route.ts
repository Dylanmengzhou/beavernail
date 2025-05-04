import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
	const { userId, nickName, contactNumber, contactType } =
		await req.json();

	console.log("userId: ", userId);
	console.log("nickName: ", nickName);
	console.log("contactNumber: ", contactNumber);
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		console.log("用户不存在");
		return NextResponse.json(
			{ success: false, message: "用户不存在" },
			{ status: 400 }
		);
	}

	await prisma.user.update({
		where: { id: userId },
		data: {
			name: nickName,
			email: contactNumber,
			contactType: contactType,
		},
	});
	return NextResponse.json({
		success: true,
		message: "用户信息更新成功",
	});
}
