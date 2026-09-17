import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
 
const handleI18nRouting = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ko'],
 
  // Used when no locale matches
  defaultLocale: 'ko',
  localeDetection: false,
  localeCookie: false
});

export default function middleware(request: NextRequest) {
  // Reset actual document loads to Korean. An absent RSC header does not
  // necessarily mean a document request, so do not redirect client navigation.
  const isDocumentRequest = request.headers.get('sec-fetch-dest') === 'document'
    || request.headers.get('sec-fetch-mode') === 'navigate';
  if (isDocumentRequest && /^\/en(?:\/|$)/.test(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname.replace(/^\/en(?=\/|$)/, '/ko');
    return NextResponse.redirect(url);
  }

  return handleI18nRouting(request);
}
 
export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /.* (all files in the `public` directory, e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
