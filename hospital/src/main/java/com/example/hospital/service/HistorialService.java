package com.example.hospital.service;

import java.util.List;
import java.util.Optional;
import com.example.hospital.entity.Historial;

public interface HistorialService {
    Historial crearHistorial(Historial historial);
    Historial actualizarHistorial(Integer id, Historial historial);
    List<Historial> listarHistorial();
    Optional<Historial> obtenerHistorialPorId(Integer id);
    void eliminarHistorial(Integer id);
}
