package com.example.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.hospital.entity.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
}
