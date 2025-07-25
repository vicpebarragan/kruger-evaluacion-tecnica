package com.kruger.backend.service;

import java.security.Principal;
import java.util.List;

import com.kruger.backend.dto.response.ProjectResponse;
import com.kruger.backend.entity.Project;
import com.kruger.backend.utils.exception.ResourceNotFoundException;

public interface ProjectService {

	ProjectResponse create(Project project, Principal principal);

	List<ProjectResponse> findProjectsByUser(Principal principal);

	ProjectResponse update(Project project, Long id) throws ResourceNotFoundException;

	void delete(Long id) throws ResourceNotFoundException;

}
