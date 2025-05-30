package com.psiplus.repository;

import com.psiplus.model.Psicologo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PsicologoRepository extends JpaRepository<Psicologo, Long> {
    Optional<Psicologo> findByUsuarioEmail(String email);

}
