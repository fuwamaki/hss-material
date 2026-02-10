import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USERNAME = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || "";
const PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || "";
const AUTH_COOKIE = "basic_auth_passed";

export function middleware(request: NextRequest) {
  // 認証済みCookieがあれば通す
  if (request.cookies.get(AUTH_COOKIE)?.value === "true") {
    return NextResponse.next();
  }

  // AuthorizationヘッダーからBasic認証情報を取得
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Basic ")) {
    const base64 = authHeader.replace("Basic ", "");
    const decoded = Buffer.from(base64, "base64").toString();
    const [user, pass] = decoded.split(":");
    if (user === USERNAME && pass === PASSWORD) {
      // 認証成功: Cookieをセットしてリダイレクト
      const res = NextResponse.next();
      res.cookies.set(AUTH_COOKIE, "true", { path: "/", httpOnly: false });
      return res;
    }
  }

  return new NextResponse("認証が必要です", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected"',
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

export const config = {
  matcher: ["/(.*)"], // 全ページ対象
};
