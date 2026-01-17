package com.example.hospital.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospital.entity.Doctor;
import com.example.hospital.service.DoctorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {
    
    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<Doctor> crearDoctor(@RequestBody Doctor doctor) {
        Doctor nuevoDoctor = doctorService.crearDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDoctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> actualizarDoctor(@PathVariable Integer id, @RequestBody Doctor doctor) {
        try {
            Doctor doctorActualizado = doctorService.actualizarDoctor(id, doctor);
            return ResponseEntity.ok(doctorActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> listarDoctores() {
        List<Doctor> doctores = doctorService.listarDoctor();
        return ResponseEntity.ok(doctores);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDoctor(@PathVariable Integer id) {
        try {
            doctorService.eliminarDoctor(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}