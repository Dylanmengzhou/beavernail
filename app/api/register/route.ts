import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const register = async (
	username: string,
	password: string,
	securityQuestion: string,
	securityAnswer: string,
	birthday: Date,
	nickname?: string,
	gender?: string,
	mode?: string
) => {
	// 检查用户名是否已存在
	const user = await prisma.user.findUnique({
		where: { username: username as string },
	});

	if (user) {
		return { success: false, error: "用户名已存在" };
	}

	// 创建新用户
	// use bcrypt to hash password
	if (mode === "create") {
		const hashedPassword = await bcrypt.hash(password, 10);
		await prisma.user.create({
			data: {
				username: username,
				password: hashedPassword,
				securityQuestion: securityQuestion,
				securityAnswer: securityAnswer,
				nickname: nickname || null,
				gender: gender
					? gender === "MALE"
						? "MALE"
						: "FEMALE"
					: null, // 确保值匹配枚举
				birthday: birthday || null,
				lastLoginAt: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});
	}

	return { success: true, error: "" };
};

export async function POST(req: NextRequest) {
	const body = await req.json();
	const {
		account,
		password,
		securityQuestion,
		securityAnswer,
		birthday,
		nickname,
		gender,
		mode,
	} = body;

	// 验证必填字段
	if (!account || !password || !securityQuestion) {
		return NextResponse.json(
			{ success: false, message: "缺少必要信息" },
			{ status: 400 }
		);
	}

	try {
		const result = await register(
			account,
			password,
			securityQuestion,
			securityAnswer,
			birthday,
			nickname,
			gender,
			mode
		);

		console.log("注册结果:", result);

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: "注册成功",
			});
		} else {
			return NextResponse.json(
				{ success: false, message: result.error },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("注册过程中发生错误:", error);
		return NextResponse.json(
			{ success: false, message: "服务器内部错误" },
			{ status: 500 }
		);
	}
}
