package com.kruger.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kruger.backend.dto.response.ProjectResponse;
import com.kruger.backend.entity.Project;
import com.kruger.backend.service.ProjectService;

class ProjectControllerTest {

	@InjectMocks
	private ProjectController projectController;

	@Mock
	private ProjectService projectService;

	@Mock
	private Principal principal;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testCreateProject() {
		Project project = new Project();
		ProjectResponse response = new ProjectResponse();
		when(projectService.create(eq(project), eq(principal))).thenReturn(response);

		ResponseEntity<ProjectResponse> result = projectController.create(project, principal);

		assertEquals(response, result.getBody());
		assertEquals(HttpStatus.OK, result.getStatusCode());
		verify(projectService).create(project, principal);
	}

	@Test
	void testGetUserProjects() {
		ProjectResponse response1 = new ProjectResponse();
		ProjectResponse response2 = new ProjectResponse();
		List<ProjectResponse> responses = Arrays.asList(response1, response2);

		when(projectService.findProjectsByUser(principal)).thenReturn(responses);

		ResponseEntity<List<ProjectResponse>> result = projectController.getUserProjects(principal);

		assertEquals(responses, result.getBody());
		assertEquals(HttpStatus.OK, result.getStatusCode());
		verify(projectService).findProjectsByUser(principal);
	}

	@Test
	void testUpdateProject() {
		Long id = 1L;
		Project project = new Project();
		ProjectResponse response = new ProjectResponse();

		when(projectService.update(project, id)).thenReturn(response);

		ResponseEntity<ProjectResponse> result = projectController.update(project, id);

		assertEquals(response, result.getBody());
		assertEquals(HttpStatus.OK, result.getStatusCode());
		verify(projectService).update(project, id);
	}

	@Test
	void testDeleteProject() {
		Long id = 1L;

		ResponseEntity<Void> result = projectController.delete(id);

		assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
		verify(projectService).delete(id);
	}
}
