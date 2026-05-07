package com.dimple.placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dimple.placement.model.Job;

public interface JobRepo extends JpaRepository<Job, Long> {
}