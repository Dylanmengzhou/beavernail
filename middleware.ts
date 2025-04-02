import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // 需要登录才能访问的路由
  const protectedRoutes = ['/profile', '/settings','/reservation']

  // 如果用户未登录且访问受保护的路由
  if (!isLoggedIn && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
    return Response.redirect(new URL('/auth/login', nextUrl))
  }

  // 如果用户已登录且访问登录页面，重定向到个人资料页
  if (isLoggedIn && nextUrl.pathname.startsWith('/auth/login')) {
    return Response.redirect(new URL('/', nextUrl))
  }
})

// 配置匹配的路由
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}