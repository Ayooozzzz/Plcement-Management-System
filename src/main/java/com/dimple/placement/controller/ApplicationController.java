package com.dimple.placement.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dimple.placement.model.Application;
import com.dimple.placement.model.Job;
import com.dimple.placement.model.User;
import com.dimple.placement.repository.ApplicationRepo;
import com.dimple.placement.repository.JobRepo;
import com.dimple.placement.repository.UserRepo;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepo applicationRepo;
    
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JobRepo jobRepo;

    // Apply for job
    @PostMapping("/apply")
    public Application apply(@RequestParam Long userId, @RequestParam Long jobId) {

        User user = userRepo.findById(userId).orElse(null);
        Job job = jobRepo.findById(jobId).orElse(null);

        Application app = new Application();
        app.setUser(user);
        app.setJob(job);
        app.setStatus("Pending");

        return applicationRepo.save(app);
    }
    // View all applications
    @GetMapping("/all")
    public List<Application> getAllApplications() {
        return applicationRepo.findAll();
    }
    }
