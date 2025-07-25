package com.kruger.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

	@Email(message = "The email must be a valid email address")
    @NotBlank(message = "The email must not be blank")
    private String email;

    @NotBlank(message = "The password must not be blank")
    @Size(min = 5, message = "The password must be at least 5 characters long")
    private String password;
}
