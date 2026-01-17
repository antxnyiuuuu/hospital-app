package com.example.hospital.service;

import java.util.List;
import java.util.Optional;
import com.example.hospital.entity.Paciente;

public interface PacienteService {
    Paciente crearPaciente(Paciente paciente);
    Paciente actualizarPaciente(Integer id, Paciente paciente);
    List<Paciente> listarPaciente();
    Optional<Paciente> obtenerPacientePorId(Integer id);
    void eliminarPaciente(Integer id);
}
