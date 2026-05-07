package com.dimple.placement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.dimple.placement.model.Job;
import com.dimple.placement.repository.JobRepo;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/jobs")
public class JobController {

    @Autowired
    private JobRepo jobRepo;

    // Add job
    @PostMapping("/add")
    public Job addJob(@RequestBody Job job) {
        return jobRepo.save(job);
    }

    // View all jobs
    @GetMapping("/all")
    public List<Job> getAllJobs() {
        return jobRepo.findAll();
    }
    
    @DeleteMapping("/delete/{id}")
    public String deleteJob(@PathVariable Long id) {
        jobRepo.deleteById(id);
        return "Job Deleted";
    }
}