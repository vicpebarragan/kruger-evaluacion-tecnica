package com.kruger.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.kruger.backend.utils.enums.TaskStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "task")
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class Task extends GeneralFields {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	
	private String description;

	@Enumerated(EnumType.STRING)
	private TaskStatus status = TaskStatus.PENDING;

	@ManyToOne
	private User assignedTo;
	
	@ManyToOne
	private Project project;
	
	private LocalDate dueDate;
	
	private LocalDateTime createdAt = LocalDateTime.now();

}
