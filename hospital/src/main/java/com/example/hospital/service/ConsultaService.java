package com.example.hospital.service;

import java.util.List;
import java.util.Optional;

import com.example.hospital.entity.Consulta;

public interface ConsultaService{
    Consulta crearConsulta(Consulta consulta);
    List<Consulta> listarConsulta();

}