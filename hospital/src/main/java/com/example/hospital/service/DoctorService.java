package com.example.hospital.service;

import java.util.List;
import java.util.Optional;
import com.example.hospital.entity.Doctor;

public interface DoctorService {
    Doctor crearDoctor(Doctor doctor);
    Doctor actualizarDoctor(Integer id, Doctor doctor);
    List<Doctor> listarDoctor();
    Optional<Doctor> obtenerDoctorPorId(Integer id);
    void eliminarDoctor(Integer id);
}
