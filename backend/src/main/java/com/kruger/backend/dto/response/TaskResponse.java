package com.kruger.backend.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.kruger.backend.utils.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {

	private Long id;

	private String title;

	private String description;

	private TaskStatus status;

	private String assignedTo;

	private Long project;

	private LocalDate dueDate;
	
	private LocalDateTime createdAt;
}
