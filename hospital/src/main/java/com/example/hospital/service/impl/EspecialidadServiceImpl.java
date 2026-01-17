package com.example.hospital.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.example.hospital.entity.Especialidad;
import com.example.hospital.repository.EspecialidadRepository;
import com.example.hospital.service.EspecialidadService;

@Service
@RequiredArgsConstructor
public class EspecialidadServiceImpl implements EspecialidadService {

    private final EspecialidadRepository especialidadRepository;

    @Override
    public Especialidad crearEspecialidad(Especialidad especialidad) {
        return especialidadRepository.save(especialidad);
    }

    @Override
    public Especialidad actualizarEspecialidad(Integer id, Especialidad especialidad) {
        Optional<Especialidad> especialidadExistente = especialidadRepository.findById(id);
        if (especialidadExistente.isPresent()) {
            Especialidad especialidadActualizar = especialidadExistente.get();
            especialidadActualizar.setNombre(especialidad.getNombre());
            especialidadActualizar.setDescripcion(especialidad.getDescripcion());
            return especialidadRepository.save(especialidadActualizar);
        }
        throw new RuntimeException("Especialidad no encontrada con id: " + id);
    }

    @Override
    public List<Especialidad> listarEspecialidad() {
        return especialidadRepository.findAll();
    }

    @Override
    public Optional<Especialidad> obtenerEspecialidadPorId(Integer id) {
        return especialidadRepository.findById(id);
    }

    @Override
    public void eliminarEspecialidad(Integer id) {
        if (especialidadRepository.existsById(id)) {
            especialidadRepository.deleteById(id);
        } else {
            throw new RuntimeException("Especialidad no encontrada con id: " + id);
        }
    }
}
