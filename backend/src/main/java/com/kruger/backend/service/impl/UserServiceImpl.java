package com.kruger.backend.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kruger.backend.dto.request.UserRequest;
import com.kruger.backend.dto.response.UserResponse;
import com.kruger.backend.entity.User;
import com.kruger.backend.mapper.UserMapper;
import com.kruger.backend.repository.UserRepository;
import com.kruger.backend.service.UserService;
import com.kruger.backend.utils.exception.ResourceNotFoundException;

@Service
public class UserServiceImpl implements UserService {

	private UserRepository userRepository;

	private PasswordEncoder passwordEncoder;

	public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public User createUser(UserRequest user) {

		User req = UserMapper.toEntity(user);
		req.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(req);
	}

	public List<UserResponse> getAllUsers() {
		return userRepository.findAll().stream()
		        .map(UserMapper::toResponse)
		        .toList();
	}

	public User getById(Long id) throws ResourceNotFoundException {
		return userRepository.findById(id).orElseThrow(() -> {
			return new ResourceNotFoundException("User with ID " + id + " not found");
		});
	}

}
