import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const { userId } = await req.json();
    console.log("账号检查，获得的userId: ", userId)
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        console.log("用户不存在")
        return NextResponse.json(
            { success: false, message: "用户不存在" },
            { status: 400 }
        );
    }

    if (!user.name || !user.email) {
        console.log("用户信息不完整")
        return NextResponse.json(
            { success: false, message: "用户信息不完整" },
            { status: 400 }
        );
    }
    return NextResponse.json({
        success: true,
        message: "用户信息完整",
        data: user,
    });
}
