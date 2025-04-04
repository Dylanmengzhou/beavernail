import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const login = async (account: string, password: string) => {
	const user = await prisma.user.findUnique({
		where: { username: account as string },
	});

	console.log("user:", user);
	if (!user) {
		return { success: false, error: "用户不存在" };
	}
	const isValid = await bcrypt.compare(
		password as string,
		user.password as string
    );

	if (!isValid) {
		return { success: false, error: "密码错误" };
    }
    // 更新最后登录时间
    await prisma.user.update({
        where: {
            username: account
        },
        data: {
            lastLoginAt: new Date()
        }
    })
	return {
        success: true,
        error: "",
        user: {
            id: user.id,
            username: user.username,
            // 返回其他需要的用户信息，但不包括密码
        }
    };
};

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { account, password } = body;
	try {
        const result = await login(account, password);
        console.log("result:", result);
        if (result.success) {
			return NextResponse.json({
				success: true,
				message: "登录成功",
                user: result.user // 返回用户信息，供前端使用
			});
        } else {
			return NextResponse.json(
				{ success: false, message: result.error },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("发生错误:", error);
		return NextResponse.json(
			{ success: false, message: "服务器内部错误" },
			{ status: 500 }
		);
	}
}
