package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.klef.soa.docker.dto.SolarDTO;
import com.klef.soa.docker.entity.Solar;
import com.klef.soa.docker.service.SolarService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:3000"
})
public class SolarController {

    @Autowired
    private SolarService service;
    
    @GetMapping("/")
    public String home() {
        return "Solar Service is running";
    }


    @PostMapping("/Add")
    public Solar addSolar(@Valid @RequestBody SolarDTO dto) {
        return service.addSolar(dto);
    }

    @GetMapping("/DisplayById/{id}")
    public Solar displaySolarById(@PathVariable Long id) {
        return service.displaySolarById(id);
    }

    @GetMapping("/DisplayAll")
    public List<Solar> displayAllSolars() {
        return service.displayAllSolars();
    }

    @PutMapping("/Update/{id}")
    public Solar updateSolar(
            @PathVariable Long id,
            @Valid @RequestBody SolarDTO dto) {
        return service.updateSolar(id, dto);
    }

    @DeleteMapping("/Delete/{id}")
    public String deleteSolar(@PathVariable Long id) {
        return service.deleteSolar(id);
    }
}