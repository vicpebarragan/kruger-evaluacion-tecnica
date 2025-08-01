package com.kruger.backend.dto.response;

import com.kruger.backend.utils.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

	private Long id;
	
	private String username;
	
	private String email;
	
	private Role role;
}
