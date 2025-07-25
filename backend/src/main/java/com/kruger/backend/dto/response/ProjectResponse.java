package com.kruger.backend.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {

	private Long id;
	
	private String name;

	private String description;

	private LocalDateTime createdAt;
	
	private String owner;
}
