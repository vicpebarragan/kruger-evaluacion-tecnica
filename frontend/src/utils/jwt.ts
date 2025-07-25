import { TokenPayload } from '@/types';

/**
 * Decode JWT token without verification
 * Note: This is for reading the payload only, not for security validation
 */
export function decodeJWT(token: string): TokenPayload | null {
    try {
        // JWT tokens have 3 parts separated by dots: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        // Decode the payload (second part)
        const payload = parts[1];

        // Add padding if needed for base64 decoding
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);

        // Decode base64
        const decodedPayload = atob(paddedPayload);

        // Parse JSON
        return JSON.parse(decodedPayload) as TokenPayload;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeJWT(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}

/**
 * Extract username from email (everything before @)
 */
export function extractUsernameFromEmail(email: string): string {
    return email.split('@')[0];
}
