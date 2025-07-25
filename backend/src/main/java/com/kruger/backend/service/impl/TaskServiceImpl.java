package com.kruger.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kruger.backend.dto.response.TaskResponse;
import com.kruger.backend.entity.Task;
import com.kruger.backend.entity.User;
import com.kruger.backend.mapper.TaskMapper;
import com.kruger.backend.repository.TaskRepository;
import com.kruger.backend.repository.UserRepository;
import com.kruger.backend.service.TaskService;
import com.kruger.backend.utils.exception.ResourceNotFoundException;

@Service
public class TaskServiceImpl implements TaskService {

	private TaskRepository taskRepository;

	private UserRepository userRepository;

	public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
		this.taskRepository = taskRepository;
		this.userRepository = userRepository;
	}

	public TaskResponse create(Task task, String name) {
		User user = userRepository.findByEmail(name).orElseThrow();
		task.setAssignedTo(user);
		return TaskMapper.toResponse(taskRepository.save(task));
	}

	public List<TaskResponse> findProjectByParameters(String name) {

		return taskRepository.findByParameters(name).stream().map(TaskMapper::toResponse).toList();

	}

	public List<TaskResponse> findProjectById(Long projectId) {

		return taskRepository.findProjectById(projectId).stream().map(TaskMapper::toResponse).toList();

	}

	public TaskResponse update(Task task, Long id) throws ResourceNotFoundException {
		Task existing = taskRepository.findById(id).orElseThrow(() -> {
			return new ResourceNotFoundException("Task with ID " + id + " doesn't exist");
		});

		existing.setTitle(task.getTitle());
		existing.setDescription(task.getDescription());
		existing.setStatus(task.getStatus());
		existing.setDueDate(task.getDueDate());

		return TaskMapper.toResponse(taskRepository.save(existing));
	}

	public void delete(Long id) throws ResourceNotFoundException {
		if (!taskRepository.existsById(id)) {
			throw new ResourceNotFoundException("Task with ID " + id + " doesn't exist");
		}
		taskRepository.deleteById(id);
	}

}
