package com.kruger.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kruger.backend.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

	@Query("SELECT t FROM Task t " 
			+ "WHERE t.assignedTo.email = :username " 
			+ "ORDER BY t.id ASC")
	List<Task> findByParameters(@Param("username") String username);

	@Query("SELECT t FROM Task t " 
			+ "WHERE t.project.id = :projectId " 
			+ "ORDER BY t.id ASC")
	List<Task> findProjectById(Long projectId);

}
