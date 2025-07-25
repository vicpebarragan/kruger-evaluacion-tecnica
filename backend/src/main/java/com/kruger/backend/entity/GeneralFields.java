package com.kruger.backend.entity;

import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@MappedSuperclass
@Data
public class GeneralFields {

	private String createdBy;
	private String updatedBy;

}
