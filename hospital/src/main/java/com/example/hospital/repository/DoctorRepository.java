package com.example.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Especialidad;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    List<Doctor> findByNombre(String nombre);
    List<Doctor> findByNombreContainingIgnoreCase(String nombre);
    List<Doctor> findByApellido(String apellido);
    List<Doctor> findByApellidoContainingIgnoreCase(String apellido);
    List<Doctor> findByEspecialidad(Especialidad especialidad);
    List<Doctor> findByEspecialidadIdEspecialidad(Integer idEspecialidad);
    List<Doctor> findByTelefono(String telefono);
    List<Doctor> findByNombreAndApellido(String nombre, String apellido);
}
