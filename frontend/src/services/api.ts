import { ApiError, ApiResponse } from '@/types';
import axios from 'axios';

class ApiService {
    private api: ReturnType<typeof axios.create>;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.115:8080/kfulltest',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - Add auth token
        this.api.interceptors.request.use(
            (config) => {
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem('authToken');
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error: unknown) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - Handle errors
        this.api.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error: unknown) => {
                if (error && typeof error === 'object' && 'response' in error) {
                    const err = error as { response?: { status?: number } };
                    if (err.response?.status === 401) {
                        // Token expired or invalid
                        this.handleAuthFailure();
                    }
                }
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: unknown): ApiError {
        const apiError: ApiError = {
            message: 'An unexpected error occurred',
            status: 500,
        };

        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as {
                response?: {
                    data?: { message?: string; errors?: unknown };
                    status?: number;
                };
                message?: string;
            };
            apiError.message = err.response?.data?.message || err.message || 'Unknown error';
            apiError.status = err.response?.status || 500;
            apiError.errors = err.response?.data?.errors as Record<string, string[]> | undefined;
        } else if (error && typeof error === 'object' && 'request' in error) {
            apiError.message = 'Network error. Please check your connection.';
            apiError.status = 0;
        } else if (error && typeof error === 'object' && 'message' in error) {
            const err = error as { message: string };
            apiError.message = err.message;
        }

        return apiError;
    }

    private handleAuthFailure(): void {
        localStorage.removeItem('authToken');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    // Set token for authenticated requests
    public setAuthToken(token: string | null): void {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // Generic API methods
    async get<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.get(url);
            return {
                success: true,
                data: response.data as T,
            };
        } catch (error) {
            throw error;
        }
    }

    async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            console.log('API POST Request:', { url, data }); // Debug log
            const response = await this.api.post(url, data);
            console.log('API POST Response:', response.data); // Debug log
            return {
                success: true,
                data: response.data as T,
            };
        } catch (error) {
            console.error('API POST Error:', error); // Debug log
            throw error;
        }
    }

    async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.put(url, data);
            return {
                success: true,
                data: response.data as T,
            };
        } catch (error) {
            throw error;
        }
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.delete(url);
            return {
                success: true,
                data: response.data as T,
            };
        } catch (error) {
            throw error;
        }
    }
}

// Export a single instance
export const apiService = new ApiService();
