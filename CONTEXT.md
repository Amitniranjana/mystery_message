# Project Context

Updated on: 2026-08-01

## 1. Current Objective
The app is a Next.js authentication flow with:
- signup
- signin
- logout
- access/refresh token-based session management
- custom Axios interceptor for 401 retry logic

## 2. Current Auth Architecture
### Frontend
- Client pages use `axios.post(...)` directly in:
  - `src/app/user/signin/page.tsx`
  - `src/app/user/signup/page.tsx`
  - `src/app/user/dashboard/page.tsx`
- Custom instance exists in `lib/axios.ts`:
  - baseURL from `NEXT_PUBLIC_API_URL`
  - `withCredentials: true`
  - response interceptor for 401 retry handling

### Backend
- Signin route: `src/app/api/signin/route.ts`
  - validates user
  - generates access + refresh tokens
  - sets cookies in response
- Refresh route: `src/app/api/verifytoken/route.ts`
  - currently reads `refreshToken`
  - validates it using `jwtVerify`
  - returns a new access token
- Logout route: `src/app/api/logout/route.ts`
  - clears access/refresh cookies
  - tries to invalidate DB state if userId found

## 3. What Was Implemented Recently
The interceptor in `lib/axios.ts` now includes:
- `axios.create(...)` custom instance
- `withCredentials: true`
- `isRefreshing` flag
- `failedQueue` for concurrent 401 requests
- `processQueue()` to retry queued requests after refresh
- 401 handling that triggers `/api/auth/refresh` and retries the original request

## 4. Important Findings / Gaps
### A. Endpoint mismatch
The interceptor calls:
- `axios.post('/api/auth/refresh', {}, { withCredentials: true });`

But the actual refresh route in the app is:
- `src/app/api/verifytoken/route.ts`

This means the interceptor is currently targeting a route that does not exist.

### B. Cookie path mismatch
In signin flow, refresh cookie is set with:
- `path: 'api/verify'`

But the interceptor expects refresh to happen through `/api/auth/refresh`.

This mismatch can prevent refresh token from being visible to the browser in the expected request path.

### C. Payload mismatch inside JWT
Signin generates token payload with:
- `id`
- `gmail`

But the refresh route expects fields like:
- `userId`
- `email`

This makes the token payload inconsistent across auth operations.

### D. Client-side axios usage is inconsistent
Most pages still use plain `axios.post(...)` instead of the custom `api` instance from `lib/axios.ts`.

That means:
- interceptor is not consistently applied
- browser cookie sending may not be reliably configured
- auth retry behavior may not work in all pages

### E. Cookie clearing behavior is inconsistent
Cookie path used while setting refresh token and cookie path used while clearing token are not aligned.

## 5. Current Working Assumption
The main goal now is not to add more features, but to make the auth flow consistent and reliable.

The interceptor is a good foundation, but the actual refresh endpoint and cookie/session contract must be aligned with the backend route implementation.

## 6. Next Priority Tasks
1. Fix the refresh endpoint route mismatch.
   - Either change interceptor target to `/api/verifytoken`
   - Or create a proper `/api/auth/refresh` route and route the logic there

2. Standardize token payload fields.
   - Use one consistent payload contract across signin, refresh, and logout
   - Prefer fields like `userId` and `email` or `id` everywhere, but keep it consistent

3. Standardize cookie path settings.
   - Ensure refresh cookie path matches where the backend reads it
   - Ensure clear-cookie path matches the set-cookie path

4. Replace plain `axios` usage with the shared custom instance.
   - Update signin/signup/dashboard pages to import and use the custom `api` instance from `lib/axios.ts`

5. Add route protection / middleware.
   - After auth is stable, add a guard so protected pages redirect unauthenticated users properly

## 7. Recommended Immediate Next Step
Start by fixing the refresh flow contract:
- route path
- cookie path
- token payload shape

Once that is consistent, the interceptor will become reliable rather than just being a partial implementation.
