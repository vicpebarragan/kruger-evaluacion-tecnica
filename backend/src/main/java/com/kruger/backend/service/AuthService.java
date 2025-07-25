package com.kruger.backend.service;

import com.kruger.backend.dto.request.LoginRequest;
import com.kruger.backend.dto.response.LoginResponse;

public interface AuthService {

	LoginResponse login(LoginRequest request);

}
