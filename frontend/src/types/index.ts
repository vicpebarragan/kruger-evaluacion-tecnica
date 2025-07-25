// Types based on OpenAPI specification

// Authentication types
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
}

export interface LoginResponse {
    token: string;
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface UserRequest {
    username: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
}

// JWT Token payload
export interface TokenPayload {
    sub: string; // email
    role: 'USER' | 'ADMIN';
    iat: number;
    exp: number;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Project types
export interface ProjectEntity {
    createdBy?: string;
    updatedBy?: string;
    id?: number;
    name: string;
    description: string;
    createdAt?: string;
    owner?: User;
}

export interface ProjectResponse {
    id: number;
    name: string | null;
    description: string | null;
    createdAt: string;
    ownerUsername: string;
}

// Task types
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface TaskEntity {
    createdBy?: string;
    updatedBy?: string;
    id?: number;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate?: string;
    createdAt?: string;
    assignedTo?: User;
    project?: ProjectEntity;
}

export interface TaskResponse {
    id: number;
    title: string | null;
    description: string | null;
    status: TaskStatus;
    dueDate?: string;
    createdAt: string;
    assignedTo?: string;
    projectId: number;
}

// Form types for creating/editing
export interface ProjectFormData {
    name: string;
    description: string;
}

export interface TaskFormData {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate?: string;
    assignedToId?: number;
    projectId: number;
}

// Filter types
export interface TaskFilters {
    status?: TaskStatus;
    dateFrom?: string;
    dateTo?: string;
    assignedTo?: number;
}

// API Response wrapper
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

// Export component types
export * from './components';

