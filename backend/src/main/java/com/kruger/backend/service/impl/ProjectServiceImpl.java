package com.kruger.backend.service.impl;

import java.security.Principal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.kruger.backend.dto.response.ProjectResponse;
import com.kruger.backend.entity.Project;
import com.kruger.backend.entity.Task;
import com.kruger.backend.entity.User;
import com.kruger.backend.mapper.ProjectMapper;
import com.kruger.backend.repository.ProjectRepository;
import com.kruger.backend.repository.TaskRepository;
import com.kruger.backend.repository.UserRepository;
import com.kruger.backend.service.ProjectService;
import com.kruger.backend.utils.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class ProjectServiceImpl implements ProjectService {

	private ProjectRepository projectRepository;

	private TaskRepository taskRepository;

	private UserRepository userRepository;

	public ProjectServiceImpl(ProjectRepository projectRepository, TaskRepository taskRepository,
			UserRepository userRepository) {
		this.projectRepository = projectRepository;
		this.taskRepository = taskRepository;
		this.userRepository = userRepository;
	}

	@Override
	public ProjectResponse create(Project project, Principal principal) {
		User owner = userRepository.findByEmail(principal.getName()).orElseThrow();
		project.setOwner(owner);
		return ProjectMapper.toResponse(projectRepository.save(project));
	}

	@Override
	public List<ProjectResponse> findProjectsByUser(Principal principal) {
		User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> {
			return new ResourceNotFoundException("User with email " + principal.getName() + " not found");
		});

		return projectRepository.findByUserId(user.getId()).stream().map(ProjectMapper::toResponse).toList();

	}

	public ProjectResponse update(Project project, Long id) throws ResourceNotFoundException {

		Project existing = projectRepository.findById(id).orElseThrow(() -> {
			return new ResourceNotFoundException("Project with ID " + id + " not found");
		});

		existing.setName(project.getName());
		existing.setDescription(project.getDescription());

		return ProjectMapper.toResponse(projectRepository.save(existing));
	}

	@Transactional
	public void delete(Long id) throws ResourceNotFoundException {

		if (!projectRepository.existsById(id)) {
			throw new ResourceNotFoundException("Project with ID " + id + "not found");
		}

		List<Task> tasks = taskRepository.findProjectById(id);

		if (!tasks.isEmpty()) {
			for (Task task : tasks) {
				taskRepository.delete(task);
			}
		}

		projectRepository.deleteById(id);
	}

}
