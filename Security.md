<h1> Security Architecture</h1>

This document outlines the security measures implemented in the application and how they mitigate common OWASP Top 10 risks.

## 1. Authentication and Access Control (A01, A07)

### Password Storage
- Passwords are hashed using **Argon2id** (`argon2` library).
- Recommended parameters are applied (`memoryCost: 12288`, `timeCost: 3`) to resist GPU-based brute-force attacks.

### Account Enumeration Protection
- `/signin` always returns a uniform 401 response.
- The same generic message (“Invalid email or password”) is used whether the email is missing or the password is incorrect.

### Session Protection
- JWTs are stored in **HTTP-only cookies**, preventing JavaScript access.
- Reduces risk of token theft through XSS.

### CSRF Protection
- Cookies use **SameSite: Strict**, preventing cross-site request inclusion.

### Route Authorization
- Protected endpoints use the `protectRoute` middleware:
  - Validates JWT signature.
  - Checks token expiration.
  - Confirms user existence via `User.findById`.

## 2. File Upload Security (A05, A09)

### File Type Verification
- Uses the `file-type` library to verify magic numbers.
- Accepts only genuine `image/jpeg` and `image/png` files.
- Prevents malicious scripts disguised as images.

### Upload Storage and Limits
- Files use in-memory storage (`multer.memoryStorage()`).
- A strict **3MB limit** is enforced to prevent memory exhaustion and DoS through large uploads.

### Image Sanitization
- All accepted files are uploaded to **Cloudinary**.
- Cloudinary reprocesses the file and strips EXIF metadata, helping eliminate hidden payloads.

## 3. Brute-Force Mitigation and Account Safety

### Login Rate Limiting
- `/api/auth/signin` uses `loginLimiter`.
- Limits failed login attempts to **10 per IP** within a six-hour period.

### Unverified Account Handling
- `signin` checks `user.isVerified`.
- If unverified:
  - Login is blocked.
  - A new verification email is automatically sent.

## 4. Logging and Auditing (A09)

### Socket Activity Logging
- `lib/socket.js` logs user IDs for all socket connections and disconnections.
- Provides clear audit visibility for real-time activity.

### Email Logging
- `sendVerificationEmail` logs every verification email attempt.
- Useful for monitoring abuse and troubleshooting delivery issues.

### Sensitive Data Protection
- Logs exclude passwords, JWTs, and API keys.
- Only non-sensitive event details are recorded.

