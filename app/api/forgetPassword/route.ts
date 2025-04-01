import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 获取用户安全问题
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const account = url.searchParams.get("account");

  if (!account) {
    return NextResponse.json(
      { success: false, message: "请提供账号" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: account },
      select: {
        id: true,
        securityQuestion: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "用户不存在" },
        { status: 404 }
      );
    }

    if (!user.securityQuestion) {
      return NextResponse.json(
        { success: false, message: "该用户未设置安全问题，请联系管理员" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      securityQuestion: user.securityQuestion,
    });
  } catch (error) {
    console.error("获取安全问题失败:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 }
    );
  }
}

// 验证安全问题答案
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { account, securityAnswer } = body;

  if (!account || !securityAnswer) {
    return NextResponse.json(
      { success: false, message: "请提供账号和安全问题答案" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: account },
      select: {
        id: true,
        securityAnswer: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "用户不存在" },
        { status: 404 }
      );
    }

    // 验证安全问题答案
    if (user.securityAnswer !== securityAnswer) {
      return NextResponse.json(
        { success: false, message: "安全问题答案错误" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "验证成功",
    });
  } catch (error) {
    console.error("验证安全问题失败:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 }
    );
  }
}
