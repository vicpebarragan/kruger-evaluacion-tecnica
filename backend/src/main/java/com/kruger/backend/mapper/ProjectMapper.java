package com.kruger.backend.mapper;

import com.kruger.backend.dto.response.ProjectResponse;
import com.kruger.backend.entity.Project;

public class ProjectMapper {

	public static ProjectResponse toResponse(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setOwner(project.getOwner().getUsername());
        return dto;
    }

}
