import { ApiResponse, ProjectEntity, ProjectFormData, ProjectResponse } from '@/types';
import { apiService } from './api';

export class ProjectService {
    // Get all projects for current user
    async getUserProjects(): Promise<ApiResponse<ProjectResponse[]>> {
        try {
            return await apiService.get<ProjectResponse[]>('/projects');
        } catch (error) {
            throw error;
        }
    }

    // Create new project
    async createProject(project: ProjectFormData): Promise<ApiResponse<ProjectResponse>> {
        try {
            const projectData: Partial<ProjectEntity> = {
                name: project.name,
                description: project.description,
            };
            return await apiService.post<ProjectResponse>('/projects', projectData);
        } catch (error) {
            throw error;
        }
    }

    // Update project
    async updateProject(id: number, project: ProjectFormData): Promise<ApiResponse<ProjectResponse>> {
        try {
            const projectData: Partial<ProjectEntity> = {
                id,
                name: project.name,
                description: project.description,
            };
            return await apiService.put<ProjectResponse>(`/projects/${id}`, projectData);
        } catch (error) {
            throw error;
        }
    }

    // Delete project
    async deleteProject(id: number): Promise<ApiResponse<void>> {
        try {
            return await apiService.delete<void>(`/projects/${id}`);
        } catch (error) {
            throw error;
        }
    }
}

export const projectService = new ProjectService();
