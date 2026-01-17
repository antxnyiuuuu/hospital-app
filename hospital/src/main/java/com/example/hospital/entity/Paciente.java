package com.example.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Entity
@Data
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer idPaciente;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "edad", nullable = false)
    private Integer edad;

    @Column(name = "cedula", nullable = false, length = 10, unique = true)
    private String cedula;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @OneToOne(mappedBy = "paciente", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("paciente")
    private Historial historial;
    
    @OneToMany(mappedBy = "paciente")
    @JsonIgnoreProperties("paciente")
    private List<Consulta> consultas;
}