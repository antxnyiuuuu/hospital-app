package com.example.hospital.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hospital.entity.Consulta;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Paciente;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {
    List<Consulta> findByPaciente(Paciente paciente);
    List<Consulta> findByPacienteIdPaciente(Integer idPaciente);
    List<Consulta> findByDoctor(Doctor doctor);
    List<Consulta> findByDoctorIdDoctor(Integer idDoctor);
    List<Consulta> findByMotivo(String motivo);
    List<Consulta> findByMotivoContainingIgnoreCase(String motivo);
    List<Consulta> findByDiagnostico(String diagnostico);
    List<Consulta> findByDiagnosticoContainingIgnoreCase(String diagnostico);
    List<Consulta> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
}
