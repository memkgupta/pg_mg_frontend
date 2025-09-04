// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { APIResponse, AuthResponse } from './types';

// The pages that are for unauthenticated users only
const authPages = ['/login', '/signup'];

// Function to refresh the access token
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken?: string; refreshToken?: string; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/token/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorisation":`Bearer ${refreshToken}`
      },
     
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data :APIResponse<AuthResponse> = await response.json();
    const tokens = data.data?.tokens;
    if(!tokens)
    {
      throw new Error("Failed to refresh token");
    }
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  } catch (error) {
    return { error: 'Token refresh failed' };
  }
}


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  
  let validAccessToken = accessToken;
  let response = NextResponse.next();

  // Check if access token exists and is expired
  if (!accessToken) {
    console.log('Access token expired, attempting refresh...');
    
    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await refreshAccessToken(refreshToken);
      
      if (refreshResult.accessToken && !refreshResult.error) {
        console.log('Token refreshed successfully');
        
        // Update the valid access token
        validAccessToken = refreshResult.accessToken;
        
        // Set new tokens in cookies
        response = NextResponse.next();
        response.cookies.set('access_token', refreshResult.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 day (adjust as needed)
        });
        
        
        if (refreshResult.refreshToken) {
          response.cookies.set('refresh_token', refreshResult.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days (adjust as needed)
          });
        }
      } else {
        console.log('Token refresh failed, clearing tokens');
        // Refresh failed, clear both tokens
        validAccessToken = undefined;
        response = NextResponse.next();
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
      }
    } else {
      console.log('No refresh token available, clearing access token');
      
      validAccessToken = undefined;
      response = NextResponse.next();
      response.cookies.delete('access_token');
    }
  }

  // Now use validAccessToken for your existing logic
  
  // If the user is logged in and tries to go to auth pages, redirect them
  if (validAccessToken && (pathname.startsWith('/login') || pathname.startsWith("/signup") || pathname.startsWith("/home"))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }


  if (!validAccessToken &&( pathname.startsWith('/dashboard') || pathname.startsWith("/account"))) {
   const originalPath = request.nextUrl.pathname + request.nextUrl.search;

   
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", originalPath);

    return NextResponse.redirect(loginUrl);
  }
  if(!validAccessToken && pathname.startsWith("/book"))
  {
   const originalPath = request.nextUrl.pathname + request.nextUrl.search;

   
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", originalPath);

    return NextResponse.redirect(loginUrl);
  }
  return response;
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*','/account/:path*',
    '/book/:path*'
  ],
};