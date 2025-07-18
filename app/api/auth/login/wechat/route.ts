import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";

const WECHAT_CONFIG = {
  appid: process.env.WECHAT_MINIAPP_APPID, // 您的小程序appid
  secret: process.env.WECHAT_MINIAPP_SECRET, // 您的小程序secret，请替换为实际值
};
export async function POST(req: NextRequest) {
  const { code, userInfo } = await req.json();
  if (!code) {
    return NextResponse.json(
      { success: false, message: "缺少code参数" },
      { status: 400 }
    );
  }

  const wechatRes = await axios.get(process.env.WECHAT_MINIAPP_URL as string, {
    params: {
      appid: WECHAT_CONFIG.appid,
      secret: WECHAT_CONFIG.secret,
      js_code: code,
      grant_type: "authorization_code",
    },
  });

  const { openid, errcode, errmsg } = wechatRes.data;
  console.log(wechatRes.data);
  if (errcode) {
    return NextResponse.json(
      { success: false, message: errmsg },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: openid as string, provider: "wechat" },
  });
  if (user) {
    await prisma.user.update({
      where: { id: openid as string },
      data: {
        lastLoginAt: new Date(),
      },
    });
  } else {
    await prisma.user.create({
      data: {
        id: openid as string,
        provider: "wechat",
        username: openid as string,
        nickname: userInfo.nickName,
        image: userInfo.avatarUrl,
      },
    });
  }

  // 获取用户余额（无论是新用户还是现有用户）
  const remainBalance: { balance: string }[] = await prisma.$queryRaw`
    SELECT 
      GREATEST(u."balance" - COALESCE((
        SELECT SUM(r2."finalPrice")
        FROM "Reservation" r2
        WHERE r2."userId" = u.id 
        AND r2."paymentMethod" = 'memberCard'
        AND r2."finalPrice" IS NOT NULL
      ), 0), 0) AS "balance"
    FROM "User" u
    WHERE id = ${openid}
  `;

  return NextResponse.json({
    success: true,
    message: "登录成功",
    token: {
      userId: openid,
      membershipType: user?.membershipType,
      remainBalance: Number(remainBalance[0].balance) || 0,
      name: user?.name
    },
  });
}
