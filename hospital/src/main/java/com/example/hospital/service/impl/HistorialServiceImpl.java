package com.example.hospital.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.example.hospital.entity.Historial;
import com.example.hospital.repository.HistorialRepository;
import com.example.hospital.service.HistorialService;

@Service
@RequiredArgsConstructor
public class HistorialServiceImpl implements HistorialService {

    private final HistorialRepository historialRepository;

    @Override
    public Historial crearHistorial(Historial historial) {
        return historialRepository.save(historial);
    }

    @Override
    public Historial actualizarHistorial(Integer id, Historial historial) {
        Optional<Historial> historialExistente = historialRepository.findById(id);
        if (historialExistente.isPresent()) {
            Historial historialActualizar = historialExistente.get();
            historialActualizar.setDescripcion(historial.getDescripcion());
            historialActualizar.setFecha(historial.getFecha());
            historialActualizar.setPaciente(historial.getPaciente());
            return historialRepository.save(historialActualizar);
        }
        throw new RuntimeException("Historial no encontrado con id: " + id);
    }

    @Override
    public List<Historial> listarHistorial() {
        return historialRepository.findAll();
    }

    @Override
    public Optional<Historial> obtenerHistorialPorId(Integer id) {
        return historialRepository.findById(id);
    }

    @Override
    public void eliminarHistorial(Integer id) {
        if (historialRepository.existsById(id)) {
            historialRepository.deleteById(id);
        } else {
            throw new RuntimeException("Historial no encontrado con id: " + id);
        }
    }
}
