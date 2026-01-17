package com.example.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "consulta")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer idConsulta;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "motivo", nullable = false)
    private String motivo;

    @Column(name = "diagnostico", columnDefinition = "TEXT")
    private String diagnostico;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_paciente", nullable = false)
    @JsonIgnoreProperties("consultas")
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_doctor", nullable = false)
    private Doctor doctor;

    @OneToOne(mappedBy = "consulta", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("consulta")
    private Receta receta;
}