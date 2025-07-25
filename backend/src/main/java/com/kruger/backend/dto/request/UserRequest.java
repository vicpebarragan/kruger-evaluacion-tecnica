package com.kruger.backend.dto.request;

import com.kruger.backend.utils.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

	@NotBlank(message = "The username must not be blank")
    @Size(max = 50, message = "The username must be at most 50 characters long")
    private String username;

    @Email(message = "The mail must be valid")
    @NotBlank(message = "The email must not be blank")
    private String email;

    @NotBlank(message = "The password must not be blank")
    @Size(min = 6, message = "The password must be at least 6 characters long")
    private String password;

    @NotNull(message = "The role must not be null")
    private Role role;
}
