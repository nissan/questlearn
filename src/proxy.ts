import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const PROTECTED = ['/learn', '/teacher', '/onboarding'];
const AUTH_ONLY = ['/auth'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('ql_session')?.value;

  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      isValid = true;
    } catch {}
  }

  if (PROTECTED.some(p => pathname.startsWith(p)) && !isValid) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }
  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && isValid) {
    return NextResponse.redirect(new URL('/learn', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/learn/:path*', '/teacher/:path*', '/onboarding/:path*', '/auth/:path*'],
};
