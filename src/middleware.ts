import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 定义需要认证的路径
const protectedPaths = [
  '/dashboard',
  '/dashboard/',
  '/dashboard/conversations',
  '/dashboard/integration',
  '/dashboard/settings',
  '/dashboard/admin',
  '/dashboard/profile'
]

// 检查路径是否需要保护
function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )
}

// 从cookie中解析用户ID
function getUserIdFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) {
    return null;
  }
  
  const authToken = cookieHeader
    .split('; ')
    .find(row => row.startsWith('auth-token='));
    
  if (!authToken) {
    return null;
  }
  
  // 解析用户ID（格式: userId|timestamp）
  const userId = authToken.split('=')[1].split('|')[0];
  return userId || null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 如果是API路由，直接通过
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }
  
  // 如果是静态资源，直接通过
  if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return NextResponse.next()
  }
  
  // 如果是认证相关页面，直接通过
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return NextResponse.next()
  }
  
  // 检查是否需要保护的路径
  if (isProtectedPath(pathname)) {
    // 检查是否存在认证令牌
    const userId = getUserIdFromCookie(request.headers.get('cookie'))
    
    // 如果未认证，重定向到登录页面
    if (!userId) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

// 配置匹配器
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了那些以特定前缀开头的：
     * - api (API路由)
     * - _next/static (静态资源)
     * - _next/image (图像优化文件)
     * - favicon.ico (favicon文件)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}