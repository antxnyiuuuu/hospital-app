package com.example.hospital.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.example.hospital.entity.Receta;
import com.example.hospital.repository.RecetaRepository;
import com.example.hospital.service.RecetaService;

@Service
@RequiredArgsConstructor
public class RecetaServiceImpl implements RecetaService {

    private final RecetaRepository recetaRepository;

    @Override
    public Receta crearReceta(Receta receta) {
        return recetaRepository.save(receta);
    }

    @Override
    public Receta actualizarReceta(Integer id, Receta receta) {
        Optional<Receta> recetaExistente = recetaRepository.findById(id);
        if (recetaExistente.isPresent()) {
            Receta recetaActualizar = recetaExistente.get();
            recetaActualizar.setMedicamento(receta.getMedicamento());
            recetaActualizar.setDosis(receta.getDosis());
            recetaActualizar.setConsulta(receta.getConsulta());
            return recetaRepository.save(recetaActualizar);
        }
        throw new RuntimeException("Receta no encontrada con id: " + id);
    }

    @Override
    public List<Receta> listarReceta() {
        return recetaRepository.findAll();
    }

    @Override
    public Optional<Receta> obtenerRecetaPorId(Integer id) {
        return recetaRepository.findById(id);
    }

    @Override
    public void eliminarReceta(Integer id) {
        if (recetaRepository.existsById(id)) {
            recetaRepository.deleteById(id);
        } else {
            throw new RuntimeException("Receta no encontrada con id: " + id);
        }
    }
}
