package com.kruger.backend.service.impl;

import org.springframework.stereotype.Service;

import com.kruger.backend.dto.request.LoginRequest;
import com.kruger.backend.dto.response.LoginResponse;
import com.kruger.backend.entity.User;
import com.kruger.backend.repository.UserRepository;
import com.kruger.backend.security.JwtProvider;
import com.kruger.backend.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService{

	private JwtProvider jwtProvider;

    private UserRepository userRepository;

    public AuthServiceImpl(JwtProvider jwtProvider, UserRepository userRepository) {
		this.jwtProvider = jwtProvider;
		this.userRepository = userRepository;
	}
    

    public LoginResponse login(LoginRequest request) {
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                	return new RuntimeException("User not found");
                });
        
        String token = jwtProvider.createToken(user);
        return new LoginResponse(token);
    }
}
