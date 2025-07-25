package com.kruger.backend.service;

import java.util.List;

import com.kruger.backend.dto.request.UserRequest;
import com.kruger.backend.dto.response.UserResponse;
import com.kruger.backend.entity.User;
import com.kruger.backend.utils.exception.ResourceNotFoundException;

public interface UserService {

	User createUser(UserRequest user);

	List<UserResponse> getAllUsers();

	User getById(Long id) throws ResourceNotFoundException;
}
