package com.example.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.hospital.entity.Receta;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Integer> {
}
