package com.psiplus.repository;

import com.psiplus.model.Paciente;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByUsuarioEmail(String email);

    @Query("SELECT p FROM Paciente p WHERE LOWER(p.usuario.nome) LIKE LOWER(:nome)")
    List<Paciente> findByUsuarioNomeContainingIgnoreCase(@Param("nome")String nome);
}
