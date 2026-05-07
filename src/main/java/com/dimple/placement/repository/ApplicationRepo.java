package com.dimple.placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dimple.placement.model.Application;

public interface ApplicationRepo extends JpaRepository<Application, Long> {
}