import { authService } from '@/services/auth';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types';
import { decodeJWT, extractUsernameFromEmail } from '@/utils/jwt';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    initialize: () => Promise<void>;
    getUserFromToken: () => User | null;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,

                // Actions
                login: async (credentials: LoginCredentials) => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await authService.login(credentials);

                        if (response.success && response.data?.token) {
                            const token = response.data.token;

                            // First set the token in the store
                            set({ token });

                            // Then get user from the token that's now in the store
                            const user = get().getUserFromToken();

                            set({
                                user,
                                token,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            throw new Error(response.message || 'Login failed');
                        }
                    } catch (error: any) {
                        set({
                            isLoading: false,
                            error: error.message || 'Login failed',
                            isAuthenticated: false,
                        });
                        throw error;
                    }
                },

                register: async (credentials: RegisterCredentials) => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await authService.register(credentials);

                        if (response.success) {
                            // After successful registration, user needs to login
                            set({
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            throw new Error(response.message || 'Registration failed');
                        }
                    } catch (error: any) {
                        set({
                            isLoading: false,
                            error: error.message || 'Registration failed',
                            isAuthenticated: false,
                        });
                        throw error;
                    }
                },

                logout: async () => {
                    try {
                        set({ isLoading: true });
                        await authService.logout();
                    } catch (error) {
                        console.error('Logout error:', error);
                    } finally {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null,
                        });
                    }
                },

                setUser: (user: User | null) => {
                    set({ user, isAuthenticated: !!user });
                },

                setToken: (token: string | null) => {
                    set({ token });
                    if (token) {
                        authService.setToken(token);
                        const user = get().getUserFromToken();
                        set({ user, isAuthenticated: true });
                    } else {
                        set({ user: null, isAuthenticated: false });
                    }
                },

                setLoading: (isLoading: boolean) => {
                    set({ isLoading });
                },

                setError: (error: string | null) => {
                    set({ error });
                },

                clearError: () => {
                    set({ error: null });
                },

                getUserFromToken: (): User | null => {
                    const { token } = get();
                    if (!token) return null;

                    const payload = decodeJWT(token);
                    if (!payload) return null;

                    return {
                        id: 0, // We don't have ID in the token, will be set when needed
                        username: extractUsernameFromEmail(payload.sub),
                        email: payload.sub,
                        role: payload.role,
                    };
                },

                initialize: async () => {
                    const token = authService.getToken();
                    if (token && authService.isAuthenticated()) {
                        const user = get().getUserFromToken();
                        set({
                            token,
                            user,
                            isAuthenticated: true,
                        });
                    } else {
                        // Clear invalid token
                        authService.logout();
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                        });
                    }
                },
            }),
            {
                name: 'auth-storage',
                partialize: state => ({
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
        {
            name: 'auth-store',
        }
    )
);
