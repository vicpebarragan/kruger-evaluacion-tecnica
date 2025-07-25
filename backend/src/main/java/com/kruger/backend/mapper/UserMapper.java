package com.kruger.backend.mapper;

import com.kruger.backend.dto.request.UserRequest;
import com.kruger.backend.dto.response.UserResponse;
import com.kruger.backend.entity.User;

public class UserMapper {

	public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public static User toEntity(UserRequest dto) {
        return User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .build();
    }

}
