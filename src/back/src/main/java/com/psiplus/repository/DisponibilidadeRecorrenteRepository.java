package com.psiplus.repository;

import com.psiplus.model.DisponibilidadeRecorrente;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DisponibilidadeRecorrenteRepository extends JpaRepository<DisponibilidadeRecorrente, Long> {
    List<DisponibilidadeRecorrente> findByPsicologoPsicologoId(Long psicologoId);
    @Transactional
    void deleteByPsicologo_PsicologoId(Long psicologoId);

    @Query("SELECT d FROM DisponibilidadeRecorrente d " +
            "WHERE d.psicologo.psicologoId = :psicologoId " +
            "AND d.diaSemana = :diaSemana " +
            "AND d.dataInicio <= :data " +
            "AND (d.dataFim IS NULL OR d.dataFim >= :data)")
    List<DisponibilidadeRecorrente> findValidDisponibilidades(
            @Param("psicologoId") Long psicologoId,
            @Param("diaSemana") Integer diaSemana,
            @Param("data") LocalDate data, LocalDate localDate);


}
