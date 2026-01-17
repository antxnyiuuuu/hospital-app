package com.example.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "historial")
public class Historial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer idHistorial;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @OneToOne
    @JoinColumn(name = "id_paciente", unique = true, nullable = false)
    @JsonIgnoreProperties("historial")
    private Paciente paciente;
}