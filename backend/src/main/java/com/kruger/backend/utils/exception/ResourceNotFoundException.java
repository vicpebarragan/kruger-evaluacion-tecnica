package com.kruger.backend.utils.exception;

public class ResourceNotFoundException extends RuntimeException {
	
	public ResourceNotFoundException(String message) {
        super(message);
    }
}
