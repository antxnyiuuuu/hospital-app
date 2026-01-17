package com.example.hospital.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.example.hospital.entity.Consulta;
import com.example.hospital.repository.ConsultaRepository;
import com.example.hospital.service.ConsultaService;

@Service
@RequiredArgsConstructor
public class ConsultaServiceImpl implements ConsultaService {
    
    private final ConsultaRepository consultaRepository;

    @Override
    public Consulta crearConsulta(Consulta consulta) {
        return consultaRepository.save(consulta);
    }

    @Override
    public List<Consulta> listarConsulta() {
        return consultaRepository.findAll();
    }
}

