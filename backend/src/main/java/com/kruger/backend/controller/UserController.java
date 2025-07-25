package com.kruger.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kruger.backend.dto.request.UserRequest;
import com.kruger.backend.dto.response.UserResponse;
import com.kruger.backend.entity.User;
import com.kruger.backend.mapper.UserMapper;
import com.kruger.backend.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Tag(name = "User Management", description = "Operations related to user management")
public class UserController {
	
	private UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	@Operation(summary = "List all users")
	public ResponseEntity<List<UserResponse>> listAll() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get user by ID")
	public ResponseEntity<UserResponse> getById(@PathVariable Long id){
		User user = userService.getById(id);
		UserResponse dto = UserMapper.toResponse(user);
		return ResponseEntity.ok(dto);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	@Operation(summary = "Register a new user")
	public ResponseEntity<UserResponse> register(@RequestBody @Valid UserRequest user) {
		return ResponseEntity.ok(UserMapper.toResponse(userService.createUser(user)));
	}
}
