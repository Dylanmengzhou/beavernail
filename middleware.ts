import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";


const { auth } = NextAuth(authConfig);
// 使用 auth 函数替代原来的 middleware 函数
export default auth((req) => {
  // // 记录请求信息
  // const rawIp = req.request.headers.get("x-forwarded-for") || "Unknown IP";
  // const ip = rawIp.includes("::ffff:") ? rawIp.split("::ffff:")[1] : rawIp;
  // const timestamp = new Date().toISOString();
  // const method = req.request.method;
  // const url = req.request.url;
  // const path = new URL(url).pathname;

  // console.log(`[${timestamp}] IP: ${ip} | ${method} | Path: ${path}`);

  // 需要登录才能访问的路由
  const protectedRoutes = ['/profile', '/settings', '/reservation'];
  if (!req.auth?.user.email
    && req.nextUrl.pathname.startsWith('/reservation')
    && !req.nextUrl.pathname.startsWith('/profile/updateProfile')

  ) {
    const updateProfileUrl = new URL('/profile/updateProfile', req.nextUrl.origin);
    return NextResponse.redirect(updateProfileUrl);
  }
  // 如果用户未登录且访问受保护的路由
  if (!req.auth && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    // 添加查询参数，表示用户是从受保护页面重定向过来的
    const loginUrl = new URL('/auth/login', req.nextUrl.origin);
    loginUrl.searchParams.set('requireLogin', 'true');
    // 保存用户想要访问的原始URL，以便登录后重定向回去
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

// 配置匹配的路由
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};