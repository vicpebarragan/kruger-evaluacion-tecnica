package com.kruger.backend.mapper;

import com.kruger.backend.dto.response.TaskResponse;
import com.kruger.backend.entity.Task;

public class TaskMapper {

	public static TaskResponse toResponse(Task task) {
        TaskResponse dto = new TaskResponse();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setAssignedTo(task.getAssignedTo().getUsername());
        dto.setProject(task.getProject().getId());
        return dto;
    }

}
