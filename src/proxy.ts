import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const token = request.cookies.get('token');
    const currentPathName = request.nextUrl.pathname;
    if (token) {
        if (currentPathName == '/user/signin' || currentPathName == '/user/signin') {
            return NextResponse.redirect(new URL('/user/dashboard', request.url));
        }
    }
    if(!token && currentPathName!=='/user/signup' &&  currentPathName!=='/user/signin'){
        return NextResponse.redirect(new URL('/user/signin' ,request.url));
    }
return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: ['/about/:path*',
        '/user/dashboard',
        '/user/signin',
        '/user/signup',
    ],
}