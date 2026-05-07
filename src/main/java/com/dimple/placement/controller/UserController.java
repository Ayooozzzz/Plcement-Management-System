package com.dimple.placement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dimple.placement.model.User;
import com.dimple.placement.repository.UserRepo;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/register")
    public User register(@RequestBody User user) 
    {
        if(user.getRole().equals("ADMIN")) {
    throw new RuntimeException("Admin cannot be created");
}
        user.setPassword(user.getPassword()); 
        return userRepo.save(user);
    }

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User user) {

    //  ADMIN LOGIN
    if (user.getEmail().equals("admin@gmail.com") && user.getPassword().equals("admin@2026")) {
        User admin = new User();
        admin.setId(0L);
        admin.setName("Admin");
        admin.setEmail("admin@gmail.com");
        admin.setRole("ADMIN");
        return ResponseEntity.ok(admin);
    }

    // RECRUITER LOGIN
    if (user.getEmail().equals("recruiter@gmail.com") && user.getPassword().equals("recruiter@2026")) {
        User recruiter = new User();
        recruiter.setId(999L);
        recruiter.setName("Recruiter");
        recruiter.setEmail("recruiter@gmail.com");
        recruiter.setRole("RECRUITER");
        return ResponseEntity.ok(recruiter);
    }

    //  STUDENT LOGIN
    User existing = userRepo.findByEmail(user.getEmail());

    if (existing != null && existing.getPassword().equals(user.getPassword())) {
        return ResponseEntity.ok(existing);
    }

    return ResponseEntity.status(401).body("Invalid email or password");
}


@PutMapping("/update/{id}")
public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {

    User user = userRepo.findById(id).orElse(null);

    if (user == null) return null;

    user.setName(updatedUser.getName());
    user.setEmail(updatedUser.getEmail());
    user.setPhone(updatedUser.getPhone());
    user.setDob(updatedUser.getDob());
    user.setEnrollment(updatedUser.getEnrollment());
    user.setResume(updatedUser.getResume());

    return userRepo.save(user);


}
//redet psword
@PutMapping("/reset-password")
public ResponseEntity<?> resetPassword(@RequestBody User req) {

    User user = userRepo.findByEmail(req.getEmail());

    if (user == null || !user.getEnrollment().equals(req.getEnrollment())) {
        return ResponseEntity.status(404).body("User not found");
    }

    user.setPassword(req.getPassword());
    userRepo.save(user);

    return ResponseEntity.ok("Password updated");
}
}