package com.kruger.backend.service;

import java.util.List;

import com.kruger.backend.dto.response.TaskResponse;
import com.kruger.backend.entity.Task;
import com.kruger.backend.utils.exception.ResourceNotFoundException;

public interface TaskService {

	TaskResponse create(Task task,String name);

	List<TaskResponse> findProjectByParameters(String name);

	List<TaskResponse> findProjectById(Long projectId);

	TaskResponse update(Task task, Long id) throws ResourceNotFoundException;

	void delete(Long id) throws ResourceNotFoundException;

}
