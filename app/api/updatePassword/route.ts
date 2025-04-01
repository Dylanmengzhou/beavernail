import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const updatePassword = async (account: string, password: string) => {
	const user = await prisma.user.findUnique({
		where: { username: account as string },
	});

	console.log("user:", user);
	if (!user) {
		return { success: false, error: "用户不存在" };
	}
    await prisma.user.update({
        where: {
            username: account
        },
        data: {
            password: await bcrypt.hash(password, 10)
        }
    })
	return { success: true, error: "" };
};

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { account, password } = body;
	try {
        const result = await updatePassword(account, password);
        console.log("result:", result);
        if (result.success) {
			return NextResponse.json({
				success: true,
				message: "更新成功",
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
