package com.example.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.hospital.entity.Historial;

@Repository
public interface HistorialRepository extends JpaRepository<Historial, Integer> {
}
