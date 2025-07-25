import { ApiResponse, LoginCredentials, LoginResponse, RegisterCredentials, UserResponse } from '@/types';
import { decodeJWT, isTokenExpired } from '@/utils/jwt';
import { apiService } from './api';

export class AuthService {
    async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
        try {
            const response = await apiService.post<LoginResponse>('/auth/login', credentials);

            if (response.success && response.data?.token) {
                // Store the token in localStorage and axios instance
                this.setToken(response.data.token);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async register(credentials: RegisterCredentials): Promise<ApiResponse<UserResponse>> {
        try {
            const response = await apiService.post<UserResponse>('/users/register', credentials);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            // Since there's no logout endpoint in the API, we just clear local storage
            this.clearToken();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearToken();
        }
    }

    // Token management
    setToken(token: string): void {
        localStorage.setItem('authToken', token);
        apiService.setAuthToken(token);
    }

    private clearToken(): void {
        localStorage.removeItem('authToken');
        apiService.setAuthToken(null);
    }

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('authToken');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Check if token is expired
        return !isTokenExpired(token);
    }

    // Get user info from token
    getUserFromToken(): { email: string; role: 'USER' | 'ADMIN'; username: string } | null {
        const token = this.getToken();
        if (!token) return null;

        const payload = decodeJWT(token);
        if (!payload) return null;

        return {
            email: payload.sub,
            role: payload.role,
            username: payload.sub.split('@')[0], // Extract username from email
        };
    }
}

export const authService = new AuthService();
