package com.example.hospital.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.example.hospital.entity.Paciente;
import com.example.hospital.repository.PacienteRepository;
import com.example.hospital.service.PacienteService;

@Service
@RequiredArgsConstructor
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;

    @Override
    public Paciente crearPaciente(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    @Override
    public Paciente actualizarPaciente(Integer id, Paciente paciente) {
        Optional<Paciente> pacienteExistente = pacienteRepository.findById(id);
        if (pacienteExistente.isPresent()) {
            Paciente pacienteActualizar = pacienteExistente.get();
            pacienteActualizar.setNombre(paciente.getNombre());
            pacienteActualizar.setApellido(paciente.getApellido());
            pacienteActualizar.setEdad(paciente.getEdad());
            pacienteActualizar.setCedula(paciente.getCedula());
            pacienteActualizar.setTelefono(paciente.getTelefono());
            return pacienteRepository.save(pacienteActualizar);
        }
        throw new RuntimeException("Paciente no encontrado con id: " + id);
    }

    @Override
    public List<Paciente> listarPaciente() {
        return pacienteRepository.findAll();
    }

    @Override
    public Optional<Paciente> obtenerPacientePorId(Integer id) {
        return pacienteRepository.findById(id);
    }

    @Override
    public void eliminarPaciente(Integer id) {
        if (pacienteRepository.existsById(id)) {
            pacienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Paciente no encontrado con id: " + id);
        }
    }
}
