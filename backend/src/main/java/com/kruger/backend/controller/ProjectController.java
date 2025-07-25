package com.kruger.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kruger.backend.dto.response.ProjectResponse;
import com.kruger.backend.entity.Project;
import com.kruger.backend.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/projects")
@Tag(name = "Project Management", description = "Operations related to project management")
public class ProjectController {

	private ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}
	

	@PostMapping
	@Operation(summary = "Create a new project")
	public ResponseEntity<ProjectResponse> create(@RequestBody Project project, Principal principal) {
		return ResponseEntity.ok(projectService.create(project,principal));
	}

	@GetMapping
	@Operation(summary = "Get all projects for the authenticated user")
	public ResponseEntity<List<ProjectResponse>> getUserProjects(Principal principal) {
		return ResponseEntity.ok(projectService.findProjectsByUser(principal));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update an existing project")
	public ResponseEntity<ProjectResponse> update(@RequestBody Project project, @PathVariable Long id){
		return ResponseEntity.ok(projectService.update(project, id));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Delete a project by ID")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		projectService.delete(id);
		return ResponseEntity.noContent().build();
	}

}
