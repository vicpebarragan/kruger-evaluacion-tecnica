
package com.kruger.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kruger.backend.dto.request.UserRequest;
import com.kruger.backend.dto.response.UserResponse;
import com.kruger.backend.entity.User;
import com.kruger.backend.mapper.UserMapper;
import com.kruger.backend.service.UserService;

class UserControllerTest {

	@InjectMocks
	private UserController userController;

	@Mock
	private UserService userService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testListAll() {
		UserResponse user1 = new UserResponse();
		UserResponse user2 = new UserResponse();
		List<UserResponse> users = Arrays.asList(user1, user2);

		when(userService.getAllUsers()).thenReturn(users);

		ResponseEntity<List<UserResponse>> result = userController.listAll();

		assertEquals(users, result.getBody());
		assertEquals(HttpStatus.OK, result.getStatusCode());
		verify(userService).getAllUsers();
	}

	@Test
	void testGetById() {
		Long id = 1L;
		User user = new User();
		UserResponse response = new UserResponse();

		when(userService.getById(id)).thenReturn(user);
		try (MockedStatic<UserMapper> mockedMapper = mockStatic(UserMapper.class)) {
			mockedMapper.when(() -> UserMapper.toResponse(user)).thenReturn(response);

			ResponseEntity<UserResponse> result = userController.getById(id);

			assertEquals(response, result.getBody());
			assertEquals(HttpStatus.OK, result.getStatusCode());
			verify(userService).getById(id);
			mockedMapper.verify(() -> UserMapper.toResponse(user));
		}
	}

	@Test
	void testRegister() {
		UserRequest userRequest = new UserRequest();
		User user = new User();
		UserResponse response = new UserResponse();

		when(userService.createUser(userRequest)).thenReturn(user);
		try (MockedStatic<UserMapper> mockedMapper = mockStatic(UserMapper.class)) {
			mockedMapper.when(() -> UserMapper.toResponse(user)).thenReturn(response);

			ResponseEntity<UserResponse> result = userController.register(userRequest);

			assertEquals(response, result.getBody());
			assertEquals(HttpStatus.OK, result.getStatusCode());
			verify(userService).createUser(userRequest);
			mockedMapper.verify(() -> UserMapper.toResponse(user));
		}
	}
}
