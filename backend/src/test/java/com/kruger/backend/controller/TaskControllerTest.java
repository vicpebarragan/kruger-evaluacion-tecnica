package com.kruger.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
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

import com.kruger.backend.dto.response.TaskResponse;
import com.kruger.backend.entity.Task;
import com.kruger.backend.service.TaskService;

class TaskControllerTest {

	@InjectMocks
	private TaskController taskController;

	@Mock
	private TaskService taskService;

	@Mock
	private Principal principal;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testCreateTask() {
		Task task = new Task();
		TaskResponse response = new TaskResponse();
		when(principal.getName()).thenReturn("user");
		when(taskService.create(task, "user")).thenReturn(response);

		ResponseEntity<TaskResponse> result = taskController.create(task, principal);

		assertEquals(response, result.getBody());
		assertEquals(HttpStatus.OK, result.getStatusCode());
		verify(taskService).create(task, "user");
	}

	@Test
	void testGetUserTasks() {
		TaskResponse response1 = new TaskResponse();
		TaskResponse response2 = new TaskResponse();
		List<TaskResponse> responses = Arrays.asList(response1, response2);

		when(principal.getName()).thenReturn("user");
		when(taskService.findProjectByParameters("user")).thenReturn(responses);

		ResponseEntity<List<TaskResponse>> result = taskController.getUserTasks(principal);

		assertEquals(responses, result.getBody());
		assertEquals(HttpStatus.OK, result.getStatusCode());
		verify(taskService).findProjectByParameters("user");
	}

	@Test
	void testGetByProject() {
		Long projectId = 1L;
		TaskResponse response1 = new TaskResponse();
		TaskResponse response2 = new TaskResponse();
		List<TaskResponse> responses = Arrays.asList(response1, response2);

		when(taskService.findProjectById(projectId)).thenReturn(responses);

		ResponseEntity<List<TaskResponse>> result = taskController.getByProject(projectId);

		assertEquals(responses, result.getBody());
		assertEquals(HttpStatus.OK, result.getStatusCode());
		verify(taskService).findProjectById(projectId);
	}

	@Test
	void testUpdateTask() {
		Long id = 1L;
		Task task = new Task();
		TaskResponse response = new TaskResponse();

		when(taskService.update(task, id)).thenReturn(response);

		ResponseEntity<TaskResponse> result = taskController.update(task, id);

		assertEquals(response, result.getBody());
		assertEquals(HttpStatus.OK, result.getStatusCode());
		verify(taskService).update(task, id);
	}

	@Test
	void testDeleteTask() {
		Long id = 1L;

		ResponseEntity<Void> result = taskController.delete(id);

		assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
		verify(taskService).delete(id);
	}
}
