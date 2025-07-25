import { ApiResponse, ProjectEntity, TaskEntity, TaskFilters, TaskFormData, TaskResponse, User, UserResponse } from '@/types';
import { apiService } from './api';

export class TaskService {
    // Get tasks for current user
    async getUserTasks(filters?: TaskFilters): Promise<ApiResponse<TaskResponse[]>> {
        try {
            const params = new URLSearchParams();
            if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
            if (filters?.dateTo) params.append('dateTo', filters.dateTo);

            const queryString = params.toString();
            const url = queryString ? `/tasks?${queryString}` : '/tasks';

            return await apiService.get<TaskResponse[]>(url);
        } catch (error) {
            throw error;
        }
    }

    // Get tasks by project ID
    async getTasksByProject(projectId: number): Promise<ApiResponse<TaskResponse[]>> {
        try {
            return await apiService.get<TaskResponse[]>(`/tasks/project/${projectId}`);
        } catch (error) {
            throw error;
        }
    }

    // Create new task
    async createTask(task: TaskFormData): Promise<ApiResponse<TaskResponse>> {
        try {
            const taskData: Partial<TaskEntity> = {
                title: task.title,
                description: task.description,
                status: task.status,
                dueDate: task.dueDate || undefined,
                project: task.projectId ? {
                    id: task.projectId,
                    name: '', // Will be ignored by the API
                    description: '' // Will be ignored by the API
                } as ProjectEntity : undefined,
                assignedTo: task.assignedToId ? {
                    id: task.assignedToId,
                    username: '', // Will be ignored by the API
                    email: '', // Will be ignored by the API
                    role: 'USER' as const // Will be ignored by the API
                } as User : undefined,
            };
            return await apiService.post<TaskResponse>('/tasks', taskData);
        } catch (error) {
            throw error;
        }
    }

    // Update task
    async updateTask(id: number, task: Partial<TaskFormData>): Promise<ApiResponse<TaskResponse>> {
        try {
            const taskData: Partial<TaskEntity> = {
                id,
                title: task.title,
                description: task.description,
                status: task.status,
                dueDate: task.dueDate || undefined,
                project: task.projectId ? {
                    id: task.projectId,
                    name: '', // Will be ignored by the API
                    description: '' // Will be ignored by the API
                } as ProjectEntity : undefined,
                assignedTo: task.assignedToId ? {
                    id: task.assignedToId,
                    username: '', // Will be ignored by the API
                    email: '', // Will be ignored by the API
                    role: 'USER' as const // Will be ignored by the API
                } as User : undefined,
            };
            return await apiService.put<TaskResponse>(`/tasks/${id}`, taskData);
        } catch (error) {
            throw error;
        }
    }

    // Delete task
    async deleteTask(id: number): Promise<ApiResponse<void>> {
        try {
            return await apiService.delete<void>(`/tasks/${id}`);
        } catch (error) {
            throw error;
        }
    }

    // Get all users (for task assignment)
    async getAllUsers(): Promise<ApiResponse<UserResponse[]>> {
        try {
            return await apiService.get<UserResponse[]>('/users');
        } catch (error) {
            throw error;
        }
    }
}

export const taskService = new TaskService();
