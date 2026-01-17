package com.example.hospital.service;

import java.util.List;
import java.util.Optional;
import com.example.hospital.entity.Receta;

public interface RecetaService {
    Receta crearReceta(Receta receta);
    Receta actualizarReceta(Integer id, Receta receta);
    List<Receta> listarReceta();
    Optional<Receta> obtenerRecetaPorId(Integer id);
    void eliminarReceta(Integer id);
}
