import { z } from 'zod';

// Schema para login basado en OpenAPI
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schema para proyectos
export const projectSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
    description: z.string().min(1, 'La descripción es requerida').max(500, 'Máximo 500 caracteres'),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Schema para tareas
export const taskSchema = z.object({
    title: z.string().min(1, 'El título es requerido').max(100, 'Máximo 100 caracteres'),
    description: z.string().min(1, 'La descripción es requerida').max(500, 'Máximo 500 caracteres'),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']),
    dueDate: z.string().optional().or(z.literal('')),
    assignedToId: z.number().optional(),
    projectId: z.number().min(1, 'Debe seleccionar un proyecto'),
});

export type TaskFormData = z.infer<typeof taskSchema>;

// Schema para filtros de tareas
export const taskFiltersSchema = z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    assignedTo: z.number().optional(),
});

export type TaskFiltersData = z.infer<typeof taskFiltersSchema>;
