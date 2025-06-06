package com.psiplus.repository;

import com.psiplus.model.ExcecaoDisponibilidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExcecaoDisponibilidadeRepository extends JpaRepository<ExcecaoDisponibilidade, Long> {
    List<ExcecaoDisponibilidade> findByPsicologoPsicologoId(Long psicologoId);
    List<ExcecaoDisponibilidade> findByPsicologo_PsicologoIdAndDataHoraInicioBetween(
            Long psicologoId,
            LocalDateTime inicio,
            LocalDateTime fim
    );
}
