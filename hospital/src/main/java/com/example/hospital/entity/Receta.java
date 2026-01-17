package com.example.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@Table(name = "receta")
public class Receta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer idReceta;

    @Column(name = "medicamento", length = 200)
    private String medicamento;

    @Column(name = "dosis", length = 200)
    private String dosis;

    @OneToOne
    @JoinColumn(name = "id_consulta", unique = true, nullable = false)
    @JsonIgnoreProperties("receta")
    private Consulta consulta;
}