import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // 需要登录才能访问的路由
  const protectedRoutes = ['/profile', '/settings','/reservation']

  // 如果用户未登录且访问受保护的路由
  if (!isLoggedIn && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
    // 添加一个查询参数，表示用户是从受保护页面重定向过来的
    const loginUrl = new URL('/auth/login', nextUrl)
    loginUrl.searchParams.set('requireLogin', 'true')
    // 可以选择性地保存用户想要访问的原始URL，以便登录后重定向回去
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  // 如果用户已登录且访问登录页面，重定向到个人资料页
  // if (isLoggedIn && nextUrl.pathname.startsWith('/auth/login')) {
  //   return Response.redirect(new URL('/', nextUrl))
  // }
})

// 配置匹配的路由
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

export function middleware(request: Request) {
  const rawIp = request.headers.get("x-forwarded-for") || "Unknown IP"
  // 处理 IPv6 映射的 IPv4 地址格式 (::ffff:172.30.1.30)
  const ip = rawIp.includes("::ffff:") ? rawIp.split("::ffff:")[1] : rawIp
  const timestamp = new Date().toISOString()
  const method = request.method
  const url = request.url
  const path = new URL(url).pathname

  console.log(`[${timestamp}] IP: ${ip} | ${method} | Path: ${path}`)
}