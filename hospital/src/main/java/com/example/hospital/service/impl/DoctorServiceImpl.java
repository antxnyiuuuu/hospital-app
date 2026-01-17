package com.example.hospital.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.example.hospital.entity.Doctor;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.service.DoctorService;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public Doctor crearDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public Doctor actualizarDoctor(Integer id, Doctor doctor) {
        Optional<Doctor> doctorExistente = doctorRepository.findById(id);
        if (doctorExistente.isPresent()) {
            Doctor doctorActualizar = doctorExistente.get();
            doctorActualizar.setNombre(doctor.getNombre());
            doctorActualizar.setApellido(doctor.getApellido());
            doctorActualizar.setTelefono(doctor.getTelefono());
            doctorActualizar.setEspecialidad(doctor.getEspecialidad());
            return doctorRepository.save(doctorActualizar);
        }
        throw new RuntimeException("Doctor no encontrado con id: " + id);
    }

    @Override
    public List<Doctor> listarDoctor() {
        return doctorRepository.findAll();
    }

    @Override
    public Optional<Doctor> obtenerDoctorPorId(Integer id) {
        return doctorRepository.findById(id);
    }

    @Override
    public void eliminarDoctor(Integer id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
        } else {
            throw new RuntimeException("Doctor no encontrado con id: " + id);
        }
    }
}
