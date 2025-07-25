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

import com.kruger.backend.dto.response.TaskResponse;
import com.kruger.backend.entity.Task;
import com.kruger.backend.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tasks")
@Tag(name = "Task Management", description = "Operations related to task management")
public class TaskController {

	private TaskService taskService;
	
	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	@PostMapping
	@Operation(summary = "Create a new task")
	public ResponseEntity<TaskResponse> create(@Valid @RequestBody Task task, Principal principal) {
		return ResponseEntity.ok(taskService.create(task,principal.getName()));
	}

	@GetMapping
	@Operation(summary = "Get all tasks for the authenticated user")
	public ResponseEntity<List<TaskResponse>> getUserTasks(Principal principal) {
		return ResponseEntity.ok(taskService.findProjectByParameters(principal.getName()));
	}

	@GetMapping("/project/{projectId}")
	@Operation(summary = "Get all tasks for a specific project")
	public ResponseEntity<List<TaskResponse>> getByProject(@PathVariable Long projectId) {
		return ResponseEntity.ok(taskService.findProjectById(projectId));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update an existing task")
	public ResponseEntity<TaskResponse> update(@Valid @RequestBody Task task, @PathVariable Long id){
		return ResponseEntity.ok(taskService.update(task, id));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Delete a task by ID")
	public ResponseEntity<Void> delete(@PathVariable Long id){
		taskService.delete(id);
		return ResponseEntity.noContent().build();
	}

}
