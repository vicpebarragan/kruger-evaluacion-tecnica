package com.kruger.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.kruger.backend.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	@Query("SELECT p FROM Project p "
			+ "WHERE p.owner.id = :userId "
			+ "ORDER BY p.id ASC")
    List<Project> findByUserId(Long userId);

}
