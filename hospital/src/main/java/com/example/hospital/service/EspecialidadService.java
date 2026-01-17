package com.example.hospital.service;

import java.util.List;
import java.util.Optional;
import com.example.hospital.entity.Especialidad;

public interface EspecialidadService {
    Especialidad crearEspecialidad(Especialidad especialidad);
    Especialidad actualizarEspecialidad(Integer id, Especialidad especialidad);
    List<Especialidad> listarEspecialidad();
    Optional<Especialidad> obtenerEspecialidadPorId(Integer id);
    void eliminarEspecialidad(Integer id);
}
