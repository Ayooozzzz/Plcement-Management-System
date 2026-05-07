package com.dimple.placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dimple.placement.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByEmail(String email);
}