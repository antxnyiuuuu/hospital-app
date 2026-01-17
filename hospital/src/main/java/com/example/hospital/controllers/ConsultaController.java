package com.example.hospital.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospital.entity.Consulta;
import com.example.hospital.service.ConsultaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/consulta")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    @PostMapping
    public ResponseEntity<Consulta> crearConsulta(@RequestBody Consulta consulta) {
        Consulta nuevaConsulta = consultaService.crearConsulta(consulta);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaConsulta);
    }

    @GetMapping
    public ResponseEntity<List<Consulta>> listarConsultas() {
        List<Consulta> consultas = consultaService.listarConsulta();
        return ResponseEntity.ok(consultas);
    }
}